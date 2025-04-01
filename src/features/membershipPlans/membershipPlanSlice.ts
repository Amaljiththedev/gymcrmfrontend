// src/features/membershipPlans/planSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '@/src/store/store';

const API_BASE_URL = "http://localhost:8000/api";

export interface MembershipPlan {
  id: number;
  name: string;
  duration_days: number;
  price: number;
  is_blocked: boolean;
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

// Async thunk to fetch all membership plans
export const fetchMembershipPlans = createAsyncThunk<
  MembershipPlan[], // Return type on success
  void,             // No argument
  { rejectValue: string }
>(
  'membershipPlans/fetchMembershipPlans',
  async (_, { rejectWithValue }) => {
    try {
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

// Async thunk to create a new membership plan
export const createPlan = createAsyncThunk<
  MembershipPlan,            // Return type on success
  Partial<MembershipPlan>,   // Argument type (data to create)
  { rejectValue: string }
>(
  'membershipPlans/createPlan',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await axios.post<MembershipPlan>(
        `${API_BASE_URL}/membership-plans/`,
        planData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || 'Failed to create membership plan'
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
    // Add any synchronous reducers if needed.
  },
  extraReducers: (builder) => {
    // Handle fetching plans
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
    
    // Handle creating a plan
    builder
      .addCase(createPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state, action: PayloadAction<MembershipPlan>) => {
        state.loading = false;
        // Add the newly created plan to the state
        state.plans.push(action.payload);
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create membership plan';
      });
  },
});

export default membershipPlanSlice.reducer;
