import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface RevenueData {
  month: string;
  revenue: number;
}

interface MonthlyRevenueState {
  data: RevenueData[];
  loading: boolean;
  error: string | null;
}

const initialState: MonthlyRevenueState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchMonthlyRevenue = createAsyncThunk(
  "reports/fetchMonthlyRevenue",
  async ({ startDate, endDate }: { startDate: string; endDate: string }, thunkAPI) => {
    try {
      const response = await axios.get("/monthly-revenue/", {
        params: { start: startDate, end: endDate },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || "Failed to fetch revenue data");
    }
  }
);

const monthlyRevenueSlice = createSlice({
  name: "monthlyRevenue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMonthlyRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default monthlyRevenueSlice.reducer;
