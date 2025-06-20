// src/features/salaryslip/salarySlipSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_BASE_URL = "http://localhost:8000/api"; // adjust to match backend

export interface SalarySlipState {
  slipUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SalarySlipState = {
  slipUrl: null,
  loading: false,
  error: null,
};

export const downloadSalarySlip = createAsyncThunk<
  string,
  { historyId: number },
  { rejectValue: string }
>("salarySlip/download", async ({ historyId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/salary-slip/${historyId}/`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to download salary slip");
  }
});

const salarySlipSlice = createSlice({
  name: "salarySlip",
  initialState,
  reducers: {
    clearSalarySlip: (state) => {
      if (state.slipUrl) URL.revokeObjectURL(state.slipUrl);
      state.slipUrl = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadSalarySlip.pending, (state) => {
        state.loading = true;
        state.slipUrl = null;
        state.error = null;
      })
      .addCase(downloadSalarySlip.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.slipUrl = action.payload;
      })
      .addCase(downloadSalarySlip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to download";
      });
  },
});

export const { clearSalarySlip } = salarySlipSlice.actions;
export default salarySlipSlice.reducer;
