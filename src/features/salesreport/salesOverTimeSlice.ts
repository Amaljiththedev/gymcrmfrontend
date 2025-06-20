// src/features/salesreport/salesOverTimeSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type MonthlySalesData = {
  month: string;
  sales: number;
};

interface State {
  data: MonthlySalesData[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  data: [],
  loading: false,
  error: null,
};

export const fetchSalesOverTime = createAsyncThunk<
  MonthlySalesData[],
  { startDate: string; endDate: string },
  { rejectValue: string }
>("sales/fetchSalesOverTime", async ({ startDate, endDate }, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/sales-over-time-chart/", {
      params: { start: startDate, end: endDate },
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to fetch sales over time chart");
  }
});

const salesOverTimeSlice = createSlice({
  name: "salesOverTime",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesOverTime.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesOverTime.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSalesOverTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default salesOverTimeSlice.reducer;
