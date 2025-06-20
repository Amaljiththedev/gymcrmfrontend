// src/features/membershipreports/planDistributionSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type PlanDistribution = {
  plan: string;
  members: number;
};

interface State {
  data: PlanDistribution[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  data: [],
  loading: false,
  error: null,
};

export const fetchPlanDistribution = createAsyncThunk<
  PlanDistribution[],
  void,
  { rejectValue: string }
>("reports/fetchPlanDistribution", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/plan-distribution-chart/");
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to fetch plan distribution");
  }
});

const planDistributionSlice = createSlice({
  name: "planDistribution",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPlanDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default planDistributionSlice.reducer;
