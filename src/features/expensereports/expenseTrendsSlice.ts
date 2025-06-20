import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type ExpenseTrend = {
  month: string;
  expenses: number;
};

interface ExpenseTrendsState {
  data: ExpenseTrend[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseTrendsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchExpenseTrends = createAsyncThunk<
  ExpenseTrend[],
  { startDate: string; endDate: string },
  { rejectValue: string }
>("expenseTrends/fetchExpenseTrends", async ({ startDate, endDate }, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/expense-trends-chart/", {
      params: { start: startDate, end: endDate },
    });
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.detail || "Failed to fetch expense trends");
  }
});

const expenseTrendsSlice = createSlice({
  name: "expenseTrends",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenseTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchExpenseTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default expenseTrendsSlice.reducer;
