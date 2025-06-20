// src/features/memberdemographics/memberQuickStatsSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type MemberQuickStats = {
  total_members: number;
  male_members: number;
  female_members: number;
};

interface State {
  data: MemberQuickStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk
export const fetchMemberQuickStats = createAsyncThunk<
  MemberQuickStats,
  void,
  { rejectValue: string }
>("reports/fetchMemberQuickStats", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/member-quick-statistics/");
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to fetch member statistics");
  }
});

const memberQuickStatsSlice = createSlice({
  name: "memberQuickStats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberQuickStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMemberQuickStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMemberQuickStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default memberQuickStatsSlice.reducer;
