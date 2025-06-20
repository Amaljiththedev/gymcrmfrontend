import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const API_BASE_URL = "http://localhost:8000/api"; // ⚠️ Update as needed

// State type
export interface SalarySlipState {
  slipUrl: string | null;
  filename: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SalarySlipState = {
  slipUrl: null,
  filename: null,
  loading: false,
  error: null,
};

// Async thunk to fetch PDF blob
export const downloadSalarySlip = createAsyncThunk<
  { url: string; filename: string },
  { historyId: number },
  { rejectValue: string }
>("salarySlip/download", async ({ historyId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/salary-slip/${historyId}/`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const filename = `salary_slip_${historyId}.pdf`;
    return { url, filename };
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to download salary slip");
  }
});

// Slice
const salarySlipSlice = createSlice({
  name: "salarySlip",
  initialState,
  reducers: {
    clearSalarySlip: (state) => {
      if (state.slipUrl) URL.revokeObjectURL(state.slipUrl);
      state.slipUrl = null;
      state.filename = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadSalarySlip.pending, (state) => {
        state.loading = true;
        state.slipUrl = null;
        state.filename = null;
        state.error = null;
      })
      .addCase(downloadSalarySlip.fulfilled, (state, action: PayloadAction<{ url: string; filename: string }>) => {
        state.loading = false;
        state.slipUrl = action.payload.url;
        state.filename = action.payload.filename;
      })
      .addCase(downloadSalarySlip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Download failed";
      });
  },
});

export const { clearSalarySlip } = salarySlipSlice.actions;
export default salarySlipSlice.reducer;