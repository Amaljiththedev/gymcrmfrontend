import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ---------------------------
// Types
// ---------------------------
interface DashboardState {
  loading: boolean;
  error: string | null;
  data: any;

  monthlySummary: any[];
  monthlyLoading: boolean;
  monthlyError: string | null;
}

// ---------------------------
// Initial State
// ---------------------------
const initialState: DashboardState = {
  loading: false,
  error: null,
  data: null,

  monthlySummary: [],
  monthlyLoading: false,
  monthlyError: null,
};

// ---------------------------
// Thunks
// ---------------------------
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (
    { startDate, endDate }: { startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/stats/", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Something went wrong");
    }
  }
);

// src/features/dashboard/dashboardSlice.ts
export const fetchMonthlySummary = createAsyncThunk(
    "dashboard/fetchMonthlySummary",
    async (
      { startDate, endDate }: { startDate: string; endDate: string },
      { rejectWithValue }
    ) => {
      try {
        const response = await axios.get("/monthly-summary/", {
          params: {
            start: startDate,
            end: endDate,
          },
        });
        return response.data;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.error || "Failed to load summary");
      }
    }
  );
  

// ---------------------------
// Slice
// ---------------------------
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // General Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Monthly Summary
    builder
      .addCase(fetchMonthlySummary.pending, (state) => {
        state.monthlyLoading = true;
        state.monthlyError = null;
      })
      .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
        state.monthlyLoading = false;
        state.monthlySummary = action.payload;
      })
      .addCase(fetchMonthlySummary.rejected, (state, action) => {
        state.monthlyLoading = false;
        state.monthlyError = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
