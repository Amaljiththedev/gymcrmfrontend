import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────
export interface Trainer {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  salary: string;
  salary_credited_date: string;
  salary_due_date: string;
  joined_date: string;
  photo: string;
  is_blocked: boolean;
}

export interface TrainerInput extends Omit<Partial<Trainer>, "photo"> {
  photo?: File | null;
}

// ──────────────────────────────────────────────────────────────
// State
// ──────────────────────────────────────────────────────────────
interface TrainerState {
  trainers: Trainer[];
  currentTrainer: Trainer | null;
  loading: boolean;
  currentLoading: boolean;
  error: string | null;
  currentError: string | null;
}

const initialState: TrainerState = {
  trainers: [],
  currentTrainer: null,
  loading: false,
  currentLoading: false,
  error: null,
  currentError: null,
};

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
const buildFormData = (data: TrainerInput) => {
  const fd = new FormData();
  fd.append("name", data.name || "");
  fd.append("email", data.email || "");
  fd.append("phone_number", data.phone_number || "");
  fd.append("address", data.address || "");
  fd.append("salary", data.salary || "0");
  if (data.salary_credited_date)
    fd.append(
      "salary_credited_date",
      new Date(data.salary_credited_date).toISOString()
    );
  if (data.salary_due_date)
    fd.append(
      "salary_due_date",
      new Date(data.salary_due_date).toISOString()
    );
  if (data.joined_date)
    fd.append("joined_date", new Date(data.joined_date).toISOString());
  fd.append("is_blocked", data.is_blocked ? "true" : "false");
  if (data.photo instanceof File) fd.append("photo", data.photo);
  return fd;
};

// ──────────────────────────────────────────────────────────────
// Thunks
// ──────────────────────────────────────────────────────────────
export const fetchTrainers = createAsyncThunk<
  Trainer[],
  void,
  { rejectValue: string }
>("trainer/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<Trainer[]>(`${API_BASE_URL}/trainers/`, {
      withCredentials: true,
    });
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch trainers"
    );
  }
});

export const fetchTrainerById = createAsyncThunk<
  Trainer,
  number,
  { rejectValue: string }
>("trainer/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<Trainer>(
      `${API_BASE_URL}/trainers/${id}/`,
      { withCredentials: true }
    );
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch trainer"
    );
  }
});

export const createTrainer = createAsyncThunk<
  Trainer,
  TrainerInput,
  { rejectValue: string }
>("trainer/create", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<Trainer>(
      `${API_BASE_URL}/trainers/`,
      buildFormData(payload),
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create trainer"
    );
  }
});

export const updateTrainer = createAsyncThunk<
  Trainer,
  { id: number; payload: TrainerInput },
  { rejectValue: string }
>("trainer/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch<Trainer>(
      `${API_BASE_URL}/trainers/${id}/`,
      buildFormData(payload),
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update trainer"
    );
  }
});

// ──────────────────────────────────────────────────────────────
// Slice
// ──────────────────────────────────────────────────────────────
const trainerSlice = createSlice({
  name: "trainers",
  initialState,
  reducers: {
    clearTrainerError(state) {
      state.error = null;
      state.currentError = null;
    },
  },
  extraReducers: (builder) =>
    builder
      // ─ Fetch All
      .addCase(fetchTrainers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchTrainers.fulfilled, (s, a: PayloadAction<Trainer[]>) => {
        s.loading = false;
        s.trainers = a.payload;
      })
      .addCase(fetchTrainers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || "Failed to fetch trainers";
      })
      // ─ Fetch One
      .addCase(fetchTrainerById.pending, (s) => {
        s.currentLoading = true;
        s.currentError = null;
      })
      .addCase(fetchTrainerById.fulfilled, (s, a: PayloadAction<Trainer>) => {
        s.currentLoading = false;
        s.currentTrainer = a.payload;
      })
      .addCase(fetchTrainerById.rejected, (s, a) => {
        s.currentLoading = false;
        s.currentError = a.payload || "Failed to fetch trainer";
      })
      // ─ Create
      .addCase(createTrainer.fulfilled, (s, a: PayloadAction<Trainer>) => {
        s.trainers.push(a.payload);
      })
      .addCase(createTrainer.rejected, (s, a) => {
        s.error = a.payload || "Failed to create trainer";
      })
      // ─ Update
      .addCase(updateTrainer.fulfilled, (s, a: PayloadAction<Trainer>) => {
        const idx = s.trainers.findIndex((t) => t.id === a.payload.id);
        if (idx !== -1) s.trainers[idx] = a.payload;
        if (s.currentTrainer?.id === a.payload.id)
          s.currentTrainer = a.payload;
      })
      .addCase(updateTrainer.rejected, (s, a) => {
        s.currentError = a.payload || "Failed to update trainer";
      }),
});

export const { clearTrainerError } = trainerSlice.actions;
export default trainerSlice.reducer;
