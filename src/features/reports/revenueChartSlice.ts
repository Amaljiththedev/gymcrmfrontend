// src/features/reports/revenueChartSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

interface PlanRevenue {
  plan: string;
  revenue: number;
}

interface RevenueChartState {
  data: PlanRevenue[];
  loading: boolean;
  error: string | null;
}

const initialState: RevenueChartState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchRevenueByPlan = createAsyncThunk<
  PlanRevenue[],
  { start: string; end: string },
  { rejectValue: string }
>(
  "revenueChart/fetchRevenueByPlan",
  async ({ start, end }, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/reports/revenue-by-plan/", {
        params: { start, end },
      });
      return response.data as PlanRevenue[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Failed to fetch revenue by plan"
      );
    }
  }
);

const revenueChartSlice = createSlice({
  name: "revenueChart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenueByPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueByPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRevenueByPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export default revenueChartSlice.reducer;
