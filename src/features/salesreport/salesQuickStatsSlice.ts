// src/features/salesreport/salesQuickStatsSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type SalesQuickStats = {
  total_revenue: number;
  total_sales: number;
  pending_payments: number;
  top_selling_plan: string | null;
};

interface State {
  data: SalesQuickStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  data: null,
  loading: false,
  error: null,
};

export const fetchSalesQuickStats = createAsyncThunk<
  SalesQuickStats,
  { startDate: string; endDate: string },
  { rejectValue: string }
>("reports/fetchSalesQuickStats", async ({ startDate, endDate }, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/sales-report-quick-stats/", {
      params: { start: startDate, end: endDate },
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to fetch sales quick stats");
  }
});

const salesQuickStatsSlice = createSlice({
  name: "salesQuickStats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesQuickStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesQuickStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSalesQuickStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default salesQuickStatsSlice.reducer;
