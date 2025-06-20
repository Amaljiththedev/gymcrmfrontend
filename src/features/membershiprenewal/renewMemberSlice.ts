// redux/slices/renewMemberSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios'; // Your axios instance
import { RootState } from '@/src/store/store';


type Plan = {
  id: number;
  name: string;
  price: string;
  duration_days: number;
};

type MemberRenewalInfo = {
  id: number;
  full_name: string;
  membership_start: string;
  membership_end: string;
  current_plan_id: number | null;
  amount_paid: string;
  remaining_balance: string;
  renewal_count: number;
};

type RenewalState = {
  loading: boolean;
  error: string | null;
  member: MemberRenewalInfo | null;
  plans: Plan[];
  successMessage: string | null;
};

const initialState: RenewalState = {
  loading: false,
  error: null,
  member: null,
  plans: [],
  successMessage: null,
};

// Async Thunks
export const fetchRenewalData = createAsyncThunk(
  'renewal/fetchData',
  async (memberId: string) => {
    const res = await axios.get(`/members/${memberId}/renew/`);
    return res.data;
  }
);

export const renewMember = createAsyncThunk(
  'renewal/renewMember',
  async (
    {
      memberId,
      membership_plan,
      membership_start,
      payment_amount,
    }: {
      memberId: string;
      membership_plan: number;
      membership_start: string;
      payment_amount: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`/members/${memberId}/renew/`, {
        membership_plan,
        membership_start,
        payment_amount,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Renewal failed');
    }
  }
);

const renewMemberSlice = createSlice({
  name: 'renewal',
  initialState,
  reducers: {
    clearRenewalState: (state) => {
      state.loading = false;
      state.error = null;
      state.member = null;
      state.plans = [];
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRenewalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRenewalData.fulfilled, (state, action) => {
        state.loading = false;
        state.member = action.payload.member;
        state.plans = action.payload.available_plans;
      })
      .addCase(fetchRenewalData.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch renewal data';
      })
      .addCase(renewMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(renewMember.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(renewMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRenewalState } = renewMemberSlice.actions;
export const selectRenewal = (state: RootState) => state.renewal;
export default renewMemberSlice.reducer;
