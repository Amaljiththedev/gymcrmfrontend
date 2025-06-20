import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// ------------------------
// Types
// ------------------------
export interface TrainerSalaryHistory {
  id: number;
  trainer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  salary: string;
  salary_credited_date: string;
  salary_due_date: string;
  created_at: string;
}

interface TrainerSalaryState {
  history: TrainerSalaryHistory[];
  loading: boolean;
  error: string | null;
  slipUrl: string | null;
  downloading: boolean;
}

const initialState: TrainerSalaryState = {
  history: [],
  loading: false,
  error: null,
  slipUrl: null,
  downloading: false,
};

// ------------------------
// Thunks
// ------------------------
export const fetchTrainerSalaryHistory = createAsyncThunk<
  TrainerSalaryHistory[],
  number
>(
  "trainerSalary/fetchTrainerSalaryHistory",
  async (trainerId, thunkAPI) => {
    try {
      // <-- corrected URL:
      const res = await axios.get<TrainerSalaryHistory[]>(
        `${API_BASE_URL}/trainer-payment-history/trainer/${trainerId}/`
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const downloadTrainerSalarySlip = createAsyncThunk<
  string,
  { historyId: number }
>(
  "trainerSalary/downloadTrainerSalarySlip",
  async ({ historyId }, thunkAPI) => {
    try {
      // <-- corrected URL:
      const response = await axios.get(
        `${API_BASE_URL}/trainers-slip/${historyId}/`,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      return window.URL.createObjectURL(blob);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ------------------------
// Slice
// ------------------------
const trainerSalarySlice = createSlice({
  name: "trainerSalary",
  initialState,
  reducers: {
    clearTrainerSlipUrl: (state) => {
      state.slipUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch history
      .addCase(fetchTrainerSalaryHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTrainerSalaryHistory.fulfilled,
        (state, action: PayloadAction<TrainerSalaryHistory[]>) => {
          state.loading = false;
          state.history = action.payload;
        }
      )
      .addCase(
        fetchTrainerSalaryHistory.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // download slip
      .addCase(downloadTrainerSalarySlip.pending, (state) => {
        state.downloading = true;
        state.error = null;
        state.slipUrl = null;
      })
      .addCase(
        downloadTrainerSalarySlip.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.downloading = false;
          state.slipUrl = action.payload;
        }
      )
      .addCase(
        downloadTrainerSalarySlip.rejected,
        (state, action: PayloadAction<any>) => {
          state.downloading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearTrainerSlipUrl } = trainerSalarySlice.actions;
export default trainerSalarySlice.reducer;
