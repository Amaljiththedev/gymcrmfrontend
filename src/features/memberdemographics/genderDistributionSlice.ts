// src/features/reports/genderDistributionSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type GenderDistribution = {
  male: number;
  female: number;
  other: number;
};

interface State {
  data: GenderDistribution | null;
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk
export const fetchGenderDistribution = createAsyncThunk<
  GenderDistribution,
  { startDate: string; endDate: string },
  { rejectValue: string }
>("reports/fetchGenderDistribution", async ({ startDate, endDate }, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/gender-distribution-chart/", {
      params: {
        start: startDate,
        end: endDate,
      },
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to fetch gender distribution");
  }
});

const genderDistributionSlice = createSlice({
  name: "genderDistribution",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenderDistribution.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGenderDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchGenderDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default genderDistributionSlice.reducer;
