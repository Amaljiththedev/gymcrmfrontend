import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

interface ManagerState {
  profile: {
    email: string;
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: ManagerState = {
  profile: null,
  loading: false,
  error: null,
};

// ───────────────────────────
// 🧠 Fetch Manager Profile
// ───────────────────────────
export const fetchManagerProfile = createAsyncThunk('manager/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/manager/profile/');
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    toast.error('Failed to fetch manager profile');
    return rejectWithValue(error.message);
  }
});

// ───────────────────────────
// 📝 Update Manager Profile
// ───────────────────────────
export const updateManagerProfile = createAsyncThunk('manager/updateProfile', async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await api.patch('/auth/manager/profile/', formData);
    toast.success('Profile updated successfully');
    return response.data.data;
  } catch (err) {
    const error = err as AxiosError;
    toast.error('Failed to update profile');
    return rejectWithValue(error.message);
  }
});

// ───────────────────────────
// 🔐 Change Manager Password
// ───────────────────────────
export const changeManagerPassword = createAsyncThunk(
  'manager/changePassword',
  async (payload: { old_password: string; new_password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/change-password/', payload);
      toast.success('Password changed successfully');
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      const message = error.response?.data?.error || 'Failed to change password';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ───────────────────────────
// 🔁 Slice
// ───────────────────────────
const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchManagerProfile.pending, state => {
        state.loading = true;
      })
      .addCase(fetchManagerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchManagerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateManagerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export default managerSlice.reducer;
