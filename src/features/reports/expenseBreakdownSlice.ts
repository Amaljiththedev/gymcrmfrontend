import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

export const fetchExpenseBreakdown = createAsyncThunk(
  "expenseBreakdown/fetch",
  async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    const response = await axiosInstance.get("/expense-category-breakdown", {
      params: { start: startDate, end: endDate },
    });
    return response.data;
  }
);

interface ExpenseCategoryData {
  category: string;
  total: number;
}

interface ExpenseBreakdownState {
  data: ExpenseCategoryData[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseBreakdownState = {
  data: [],
  loading: false,
  error: null,
};

const expenseBreakdownSlice = createSlice({
  name: "expenseBreakdown",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenseBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchExpenseBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load expense breakdown";
      });
  },
});

export default expenseBreakdownSlice.reducer;
