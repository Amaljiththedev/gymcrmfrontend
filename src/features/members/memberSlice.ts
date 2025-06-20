import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '@/src/store/store';
import { MembershipPlan } from '../membershipPlans/membershipPlanSlice';

const API_BASE_URL = "http://localhost:8000/api";

// ---------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------

export interface Member {
  biometric_id?: number;
  biometric_registered: boolean;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  gender?: string; // Added gender field
  height?: number;
  weight?: number;
  dob?: string;
  membership_start: string;
  membership_plan: MembershipPlan;
  is_blocked: boolean;
  amount_paid: number;
  membership_end: string;
  is_fully_paid: boolean;
  days_present: number;
  photo?: string;
  membership_status: string; // e.g. "active", "expired", "blocked", etc.
}

interface RenewMemberPayload {
  memberId: number;
  membership_plan: number;
  membership_start: string;
  payment_amount: number;
}


export interface MemberCreateInput extends Omit<Partial<Member>, 'photo' | 'membership_plan'> {
  membership_plan: number;
  photo?: File;
}

interface MemberState {
  members: Member[];
  expiredMembers: Member[];
  expiringMembers: Member[];
  incompletePaymentMembers: Member[];
  activeMembers: Member[];
  member: Member | null;
  loading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  members: [],
  expiredMembers: [],
  expiringMembers: [],
  incompletePaymentMembers: [],
  activeMembers: [],
  member: null,
  loading: false,
  error: null,
};

// ---------------------------------------------------------------------
// Thunks
// ---------------------------------------------------------------------

// Create a new member with FormData
export const createMember = createAsyncThunk<Member, MemberCreateInput, { rejectValue: string }>(
  'members/createMember',
  async (memberData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("first_name", memberData.first_name || "");
      formData.append("last_name", memberData.last_name || "");
      formData.append("email", memberData.email || "");
      if (memberData.phone) formData.append("phone", memberData.phone);
      if (memberData.address) formData.append("address", memberData.address);
      // Append gender if available
      if (memberData.gender) formData.append("gender", memberData.gender);

      let membershipStartISO = memberData.membership_start 
        ? new Date(memberData.membership_start).toISOString() 
        : "";
      formData.append("membership_start", membershipStartISO);
      formData.append("membership_plan_id", String(memberData.membership_plan));
      formData.append("amount_paid", String(memberData.amount_paid || 0));
      if (memberData.height) formData.append("height", String(memberData.height));
      if (memberData.weight) formData.append("weight", String(memberData.weight));
      if (memberData.dob) formData.append("dob", memberData.dob);
      formData.append("is_blocked", String(memberData.is_blocked));
      if (memberData.photo) formData.append("photo", memberData.photo);

      const response = await axios.post<Member>(
        `${API_BASE_URL}/members/`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create member');
    }
  }
);

// Fetch all members (Active + Expired)
export const fetchMembers = createAsyncThunk<Member[], void, { rejectValue: string }>(
  'members/fetchMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Member[]>(`${API_BASE_URL}/members/`, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch members');
    }
  }
);

// Fetch expired members
export const fetchExpiredMembers = createAsyncThunk<Member[], void, { rejectValue: string }>(
  'members/fetchExpiredMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Member[]>(`${API_BASE_URL}/members/expired_members/`, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch expired members');
    }
  }
);

// Fetch expiring members (membership ending in the next 5 days)
export const fetchExpiringMembers = createAsyncThunk<Member[], void, { rejectValue: string }>(
  'members/fetchExpiringMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Member[]>(`${API_BASE_URL}/members/expiring_members/`, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch expiring members');
    }
  }
);

// Fetch members with incomplete payment (not fully paid)
export const fetchIncompletePaymentMembers = createAsyncThunk<Member[], void, { rejectValue: string }>(
  'members/fetchIncompletePaymentMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Member[]>(`${API_BASE_URL}/members/not_fully_paid/`, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incomplete payment members');
    }
  }
);

// Fetch active members
export const fetchActiveMembers = createAsyncThunk<Member[], void, { rejectValue: string }>(
  'members/fetchActiveMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Member[]>(`${API_BASE_URL}/members/active_members/`, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active members');
    }
  }
);

export const fetchMemberById = createAsyncThunk<Member, number, { rejectValue: string }>(
  'members/fetchMemberById',
  async (memberId, { rejectWithValue }) => {
    try {
      const response = await axios.get<Member>(
        `${API_BASE_URL}/members/${memberId}/`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch member');
    }
  }
);

export const updateMember = createAsyncThunk<Member, { memberId: number; memberData: FormData }, { rejectValue: string }>(
  'members/updateMember',
  async ({ memberId, memberData }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Member>(
        `${API_BASE_URL}/members/${memberId}/`,
        memberData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update member');
    }
  }
);


// ---------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------
const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Member
      .addCase(createMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action: PayloadAction<Member>) => {
        state.loading = false;
        state.member = action.payload;
        state.members.push(action.payload);
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create member';
      })
      // Fetch All Members
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action: PayloadAction<Member[]>) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch members';
      })
      // Fetch Expired Members
      .addCase(fetchExpiredMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpiredMembers.fulfilled, (state, action: PayloadAction<Member[]>) => {
        state.loading = false;
        state.expiredMembers = action.payload;
      })
      .addCase(fetchExpiredMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch expired members';
      })
      // Fetch Expiring Members
      .addCase(fetchExpiringMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpiringMembers.fulfilled, (state, action: PayloadAction<Member[]>) => {
        state.loading = false;
        state.expiringMembers = action.payload;
      })
      .addCase(fetchExpiringMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch expiring members';
      })
      // Renew Member

            // Update Member (full update)
      .addCase(updateMember.pending, (state: MemberState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state: MemberState, action: PayloadAction<Member>) => {
        state.loading = false;
        state.member = action.payload;
        state.members = state.members.map((m) =>
          m.id === action.payload.id ? action.payload : m
        );
      })
      .addCase(updateMember.rejected, (state: MemberState, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update member';
      })
      // Fetch Incomplete Payment Members
      .addCase(fetchIncompletePaymentMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncompletePaymentMembers.fulfilled, (state, action: PayloadAction<Member[]>) => {
        state.loading = false;
        state.incompletePaymentMembers = action.payload;
      })
      .addCase(fetchIncompletePaymentMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch incomplete payment members';
      })
      // Fetch Active Members
      .addCase(fetchActiveMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveMembers.fulfilled, (state, action: PayloadAction<Member[]>) => {
        state.loading = false;
        state.activeMembers = action.payload;
      })
      .addCase(fetchActiveMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch active members';
      })
      // Fetch Member By ID
      .addCase(fetchMemberById.pending, (state: MemberState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberById.fulfilled, (state: MemberState, action: PayloadAction<Member>) => {
        state.loading = false;
        state.member = action.payload;
      })
      .addCase(fetchMemberById.rejected, (state: MemberState, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch member';
      });

      
  },
});

export const { clearError } = memberSlice.actions;
export default memberSlice.reducer;
