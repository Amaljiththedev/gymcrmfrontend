import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ------------------------
// Types
// ------------------------
export interface SalaryHistory {
  id: number;
  staff: {
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

interface SalaryState {
  history: SalaryHistory[];
  loading: boolean;
  error: string | null;
  slipUrl: string | null;
  downloading: boolean;
}

const initialState: SalaryState = {
  history: [],
  loading: false,
  error: null,
  slipUrl: null,
  downloading: false,
};

// ------------------------
// Thunks
// ------------------------
export const fetchSalaryHistory = createAsyncThunk<SalaryHistory[], number>(
  "salary/fetchSalaryHistory",
  async (staffId, thunkAPI) => {
    try {
      const res = await axios.get(`/staff-salary-payments/staff/${staffId}/`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const downloadSalarySlip = createAsyncThunk<string, { historyId: number }>(
  "salary/downloadSalarySlip",
  async ({ historyId }, thunkAPI) => {
    try {
      const response = await axios.get(`/salary-slip/${historyId}/`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      return url;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ------------------------
// Slice
// ------------------------
const salarySlice = createSlice({
  name: "salary",
  initialState,
  reducers: {
    clearSlipUrl: (state) => {
      state.slipUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalaryHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalaryHistory.fulfilled, (state, action: PayloadAction<SalaryHistory[]>) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchSalaryHistory.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(downloadSalarySlip.pending, (state) => {
        state.downloading = true;
        state.error = null;
        state.slipUrl = null;
      })
      .addCase(downloadSalarySlip.fulfilled, (state, action: PayloadAction<string>) => {
        state.downloading = false;
        state.slipUrl = action.payload;
      })
      .addCase(downloadSalarySlip.rejected, (state, action: PayloadAction<any>) => {
        state.downloading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSlipUrl } = salarySlice.actions;
export default salarySlice.reducer;
