import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

export const fetchReportsOverview = createAsyncThunk(
  "reportsOverview/fetch",
  async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    const response = await axiosInstance.get("/reports-overview", {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  }
);

interface ReportsOverviewState {
  data: {
    total_revenue: number;
    total_expenses: number;
    active_members: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportsOverviewState = {
  data: null,
  loading: false,
  error: null,
};

const reportsOverviewSlice = createSlice({
  name: "reportsOverview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportsOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchReportsOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch overview";
      });
  },
});

export default reportsOverviewSlice.reducer;
