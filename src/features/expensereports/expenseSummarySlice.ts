
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

interface ExpenseStats {
  total_expenses: number;
  largest_category: string;
  pending_payments: number;
}

interface ExpenseStatsState {
  data: ExpenseStats | null;
  loading: boolean;
  error: string | null;
}

// initial state
const initialState: ExpenseStatsState = {
  data: null,
  loading: false,
  error: null,
};

// thunk
export const fetchExpenseQuickStats = createAsyncThunk<
  ExpenseStats,
  { startDate: string; endDate: string },
  { rejectValue: string }
>(
  "expenses/fetchQuickStats",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/expense-summary-stats/", {
        params: { start: startDate, end: endDate },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch expense stats");
    }
  }
);

// slice
const expenseQuickStatsSlice = createSlice({
  name: "expenseQuickStats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenseQuickStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseQuickStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchExpenseQuickStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default expenseQuickStatsSlice.reducer;