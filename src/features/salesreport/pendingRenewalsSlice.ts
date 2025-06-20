// src/features/salesreport/pendingRenewalsSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type PendingRenewalData = {
  month: string;
  pendingRenewals: number;
};

interface State {
  data: PendingRenewalData[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  data: [],
  loading: false,
  error: null,
};

export const fetchPendingRenewals = createAsyncThunk<
  PendingRenewalData[],
  { startDate: string; endDate: string },
  { rejectValue: string }
>("sales/fetchPendingRenewals", async ({ startDate, endDate }, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/pending-renewals-chart/", {
      params: { start: startDate, end: endDate },
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to fetch pending renewals");
  }
});

const pendingRenewalsSlice = createSlice({
  name: "pendingRenewals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingRenewals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingRenewals.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPendingRenewals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default pendingRenewalsSlice.reducer;
