// src/features/payment/paymentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/src/store/store";

const API_BASE_URL = "http://localhost:8000/api"; // Adjust as needed

// ---------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------
export interface PaymentHistoryRecord {
  id: number;
  member_id: number;
  membership_plan_id: number;
  plan_name_snapshot: string;
  plan_price_snapshot: string;
  plan_duration_snapshot: number;
  membership_start: string;
  membership_end: string;
  transaction_type: string;
  payment_amount: string;
  renewal_count: number;
  transaction_date: string;
}

interface PaymentState {
  history: PaymentHistoryRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  history: [],
  loading: false,
  error: null,
};

// ---------------------------------------------------------------------
// Thunk: Fetch Payment History
// ---------------------------------------------------------------------
export const fetchPaymentHistory = createAsyncThunk<
  PaymentHistoryRecord[],
  string,
  { rejectValue: string }
>(
  "payment/fetchPaymentHistory",
  async (memberId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/payment-history/member/${memberId}/`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment history"
      );
    }
  }
);

// ---------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentHistory: (state) => {
      state.history = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPaymentHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchPaymentHistory.fulfilled,
      (state, action: PayloadAction<PaymentHistoryRecord[]>) => {
        state.loading = false;
        state.history = action.payload;
      }
    );
    builder.addCase(
      fetchPaymentHistory.rejected,
      (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch payment history";
      }
    );
  },
});

export const { clearPaymentHistory } = paymentSlice.actions;
export default paymentSlice.reducer;
