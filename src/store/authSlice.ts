// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  email?: string;
  username?: string;
  role: 'manager' | 'staff';
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const API_BASE_URL = "http://localhost:8000/api/auth/";

// Async thunk for manager login
export const loginManager = createAsyncThunk<
  UserProfile,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginManager',
  async ({ email, password }, thunkAPI) => {
    try {
      // Call the backend manager login endpoint
      const res = await fetch(`${API_BASE_URL}login/manager/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Send/receive HTTP‑only cookies
      });
      if (!res.ok) {
        const data = await res.json();
        return thunkAPI.rejectWithValue(data.error || 'Login failed');
      }
      // After login, fetch the profile
      const profileRes = await fetch(`${API_BASE_URL}profile/`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!profileRes.ok) {
        return thunkAPI.rejectWithValue('Failed to fetch profile.');
      }
      const profileData = await profileRes.json();
      return profileData as UserProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for manager logout
export const logoutManager = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutManager',
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE_URL}logout/`, {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent
      });
      if (!res.ok) {
        const data = await res.json();
        return thunkAPI.rejectWithValue(data.error || 'Logout failed');
      }
      // Backend should clear the cookies (e.g., via response.delete_cookie)
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk to refresh tokens and update the profile
export const refreshToken = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>(
  'auth/refreshToken',
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE_URL}refresh/`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        return thunkAPI.rejectWithValue(data.error || 'Token refresh failed');
      }
      // Fetch profile after token refresh
      const profileRes = await fetch(`${API_BASE_URL}profile/`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!profileRes.ok) {
        return thunkAPI.rejectWithValue('Failed to fetch profile after token refresh.');
      }
      const profileData = await profileRes.json();
      return profileData as UserProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Allows manual resetting of auth state
    resetAuthState(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    // Manually set the user
    setUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Login handlers
    builder.addCase(loginManager.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginManager.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(loginManager.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Login failed';
      state.isAuthenticated = false;
    });
    // Logout handlers
    builder.addCase(logoutManager.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutManager.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
    builder.addCase(logoutManager.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Logout failed';
    });
    // Refresh token handlers
    builder.addCase(refreshToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(refreshToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Token refresh failed';
      state.isAuthenticated = false;
    });
  },
});

export const { resetAuthState, setUser } = authSlice.actions;
export default authSlice.reducer;
