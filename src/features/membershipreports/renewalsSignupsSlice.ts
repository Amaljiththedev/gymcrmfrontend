// src/features/reports/renewalsSignupsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

type MonthlyData = {
  month: string;
  renewals: number;
  signups: number;
};

interface State {
  data: MonthlyData[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  data: [],
  loading: false,
  error: null,
};

export const fetchRenewalsSignups = createAsyncThunk<
  MonthlyData[],
  { startDate: string; endDate: string },
  { rejectValue: string }
>("reports/fetchRenewalsSignups", async ({ startDate, endDate }, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/renewals-signups-chart/", {
      params: { start: startDate, end: endDate },
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to fetch chart data");
  }
});

const slice = createSlice({
  name: "renewalsSignups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRenewalsSignups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRenewalsSignups.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRenewalsSignups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default slice.reducer;
