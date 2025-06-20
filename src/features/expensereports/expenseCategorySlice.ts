// src/features/expensereports/expenseCategorySlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type ExpenseCategoryData = {
  category: string;
  amount: number;
};

interface ExpenseCategoryState {
  data: ExpenseCategoryData[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseCategoryState = {
  data: [],
  loading: false,
  error: null,
};

// ✅ Thunk
export const fetchExpenseCategoryChart = createAsyncThunk<
  ExpenseCategoryData[],
  { startDate: string; endDate: string },
  { rejectValue: string }
>("expense/fetchExpenseCategoryChart", async ({ startDate, endDate }, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/expense-category-breakdown/", {
      params: {
        start: startDate,
        end: endDate,
      },
    });

    // ✅ Normalize backend data
    return response.data.map((item: any) => ({
      category: item.category,
      amount: item.total_amount,  // ✅ IMPORTANT: map total_amount to amount
    }));
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch");
  }
});

// ✅ Slice
const expenseCategorySlice = createSlice({
  name: "expenseCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenseCategoryChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseCategoryChart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchExpenseCategoryChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default expenseCategorySlice.reducer;
