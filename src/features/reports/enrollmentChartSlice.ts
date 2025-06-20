// src/features/reports/enrollmentChartSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

interface ChartPoint {
  month: string;
  enrollments: number;
}

interface ChartState {
  data: ChartPoint[];
  loading: boolean;
  error: string | null;
}

const initialState: ChartState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchEnrollmentChart = createAsyncThunk<
  ChartPoint[],
  { start: string; end: string },
  { rejectValue: string }
>(
  "chart/fetchEnrollmentChart",
  async ({ start, end }, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/reports/enrollment-chart/", {
        params: { start, end },
      });
      return response.data as ChartPoint[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Failed to fetch chart data"
      );
    }
  }
);

const enrollmentChartSlice = createSlice({
  name: "enrollmentChart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrollmentChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollmentChart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEnrollmentChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export default enrollmentChartSlice.reducer;
