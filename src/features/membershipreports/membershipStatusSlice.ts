// src/features/reports/membershipStatusSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type StatusCounts = {
  total: number;
  blocked: number;
  expired: number;
  payment_due: number;
  expiring: number;
  active: number;
};

interface State {
  data: StatusCounts | null;
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  data: null,
  loading: false,
  error: null,
};

export const fetchMembershipStatusCounts = createAsyncThunk<StatusCounts>(
  "reports/fetchMembershipStatusCounts",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/membership-status-counts/");
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to fetch membership status counts");
    }
  }
);

const membershipStatusSlice = createSlice({
  name: "membershipStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembershipStatusCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipStatusCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMembershipStatusCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default membershipStatusSlice.reducer;
