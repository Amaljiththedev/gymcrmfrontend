// src/features/salesreport/salesByPlanSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type PlanSalesData = {
  plan: string;
  sales: number;
};

interface State {
  data: PlanSalesData[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  data: [],
  loading: false,
  error: null,
};

export const fetchSalesByPlan = createAsyncThunk<
  PlanSalesData[],
  { startDate: string; endDate: string },
  { rejectValue: string }
>("sales/fetchSalesByPlan", async ({ startDate, endDate }, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/sales-by-plan-chart/", {
      params: { start: startDate, end: endDate },
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to fetch sales by plan");
  }
});

const salesByPlanSlice = createSlice({
  name: "salesByPlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesByPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesByPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSalesByPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default salesByPlanSlice.reducer;
