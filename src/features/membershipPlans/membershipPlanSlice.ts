// membershipPlanSlice
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '@/src/store/store';

const API_BASE_URL = "http://localhost:8000/api";

export interface MembershipPlan {
  id: number;
  name: string;
  duration_days: number;
  price: number;
  is_locked: boolean;
}

interface MembershipPlanState {
  plans: MembershipPlan[];
  loading: boolean;
  error: string | null;
}

const initialState: MembershipPlanState = {
  plans: [],
  loading: false,
  error: null,
};

export const fetchMembershipPlans = createAsyncThunk<
  MembershipPlan[], // Successful response type
  void,             // No argument is required
  { rejectValue: string }
>(
  'membershipPlans/fetchMembershipPlans',
  async (_, { rejectWithValue }) => {
    try {
      // Include withCredentials to send HTTP-only cookies.
      const response = await axios.get<MembershipPlan[]>(
        `${API_BASE_URL}/membership-plans/`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || 'Failed to fetch membership plans'
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

const membershipPlanSlice = createSlice({
  name: 'membershipPlans',
  initialState,
  reducers: {
    // Add synchronous reducers if needed.
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembershipPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMembershipPlans.fulfilled,
        (state, action: PayloadAction<MembershipPlan[]>) => {
          state.loading = false;
          state.plans = action.payload;
        }
      )
      .addCase(fetchMembershipPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch membership plans';
      });
  },
});

export default membershipPlanSlice.reducer;
