import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type AgeGenderData = {
  category: string;
  count: number;
};

interface AgeGenderBreakdownState {
  data: AgeGenderData[];
  loading: boolean;
  error: string | null;
}

const initialState: AgeGenderBreakdownState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchAgeGenderBreakdown = createAsyncThunk<
  AgeGenderData[],
  { startDate: string; endDate: string },
  { rejectValue: string }
>("memberDemographics/fetchAgeGenderBreakdown", async ({ startDate, endDate }, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/age-gender-breakdown-chart/", {
      params: { start: startDate, end: endDate },
    });
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.detail || "Failed to fetch Age Gender Breakdown");
  }
});

const ageGenderBreakdownSlice = createSlice({
  name: "ageGenderBreakdown",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgeGenderBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgeGenderBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAgeGenderBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default ageGenderBreakdownSlice.reducer;
