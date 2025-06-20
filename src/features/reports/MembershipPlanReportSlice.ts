// src/features/reports/membershipPlanStatsSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

interface ReportData {
  total_enrollments: number;
  total_revenue: number;
  most_popular_plan: string;
}

interface ReportState {
  data: ReportData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchMembershipPlanStats = createAsyncThunk<
  ReportData,
  { start: string; end: string },
  { rejectValue: string }
>(
  "report/fetchMembershipPlanStats",
  async ({ start, end }, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/reports/membership-plan/", {
        params: { start, end },
      });
      return response.data as ReportData;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Failed to fetch membership plan stats"
      );
    }
  }
);

const membershipPlanStatsSlice = createSlice({
  name: "membershipPlanStats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembershipPlanStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipPlanStats.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchMembershipPlanStats.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Unknown error";
      });
  },
});

export default membershipPlanStatsSlice.reducer;
