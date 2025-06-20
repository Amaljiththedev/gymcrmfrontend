// src/features/reports/membershipGrowthSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type MonthlyMembershipData = {
  month: string;
  members: number;
};

interface MembershipChartState {
  data: MonthlyMembershipData[];
  loading: boolean;
  error: string | null;
}

const initialState: MembershipChartState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchMembershipGrowth = createAsyncThunk<
  MonthlyMembershipData[],
  { startDate: string; endDate: string },
  { rejectValue: string }
>("reports/fetchMembershipGrowth", async ({ startDate, endDate }, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/membership-growth-chart/", {
      params: {
        start: startDate,
        end: endDate,
      },
    });
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.detail || "Failed to fetch");
  }
});

const membershipChartSlice = createSlice({
  name: "membershipChart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembershipGrowth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipGrowth.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMembershipGrowth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default membershipChartSlice.reducer;
