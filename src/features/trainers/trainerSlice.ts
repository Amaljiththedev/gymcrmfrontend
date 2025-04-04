import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8000/api";

// Trainer Interface
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

// Input type for trainer creation
export interface TrainerCreateInput extends Omit<Partial<Trainer>, 'photo'> {
  photo?: File | null;
}

// State interface
interface TrainerState {
  trainers: Trainer[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: TrainerState = {
  trainers: [],
  loading: false,
  error: null,
};

// Async thunk to fetch trainers
export const fetchTrainers = createAsyncThunk<
  Trainer[],
  void,
  { rejectValue: string }
>('trainer/fetchTrainers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Trainer[]>(`${API_BASE_URL}/trainers/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch trainers');
  }
});

// Async thunk to create a trainer
export const createTrainer = createAsyncThunk<
  Trainer,
  TrainerCreateInput,
  { rejectValue: string }
>('trainer/createTrainer', async (trainerData, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('name', trainerData.name || '');
    formData.append('email', trainerData.email || '');
    formData.append('phone_number', trainerData.phone_number || '');
    formData.append('address', trainerData.address || '');
    formData.append('salary', trainerData.salary || '0');

    if (trainerData.salary_credited_date) {
      formData.append('salary_credited_date', new Date(trainerData.salary_credited_date).toISOString());
    }
    if (trainerData.salary_due_date) {
      formData.append('salary_due_date', new Date(trainerData.salary_due_date).toISOString());
    }
    if (trainerData.joined_date) {
      formData.append('joined_date', new Date(trainerData.joined_date).toISOString());
    }

    formData.append('is_blocked', trainerData.is_blocked ? 'true' : 'false');

    // Append photo if provided
    if (trainerData.photo instanceof File) {
      formData.append('photo', trainerData.photo);
    }

    // API call
    const response = await axios.post<Trainer>(`${API_BASE_URL}/trainers/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create trainer');
  }
});

// Slice Definition
const trainerSlice = createSlice({
  name: 'trainers',
  initialState,
  reducers: {
    clearTrainerError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Trainers Cases
      .addCase(fetchTrainers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainers.fulfilled, (state, action: PayloadAction<Trainer[]>) => {
        state.loading = false;
        state.trainers = action.payload;
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch trainers';
      })
      
      // Create Trainer Cases
      .addCase(createTrainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrainer.fulfilled, (state, action: PayloadAction<Trainer>) => {
        state.loading = false;
        state.trainers.push(action.payload);
      })
      .addCase(createTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create trainer';
      });
  },
});

// Export actions and reducer
export const { clearTrainerError } = trainerSlice.actions;
export default trainerSlice.reducer;
