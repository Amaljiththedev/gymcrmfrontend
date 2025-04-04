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

// Async thunk for manager login with debugging logs
export const loginManager = createAsyncThunk<
  UserProfile,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginManager',
  async ({ email, password }, thunkAPI) => {
    try {
      console.log('Attempting login with:', { email, password });
      // Send login request to backend
      const loginResponse = await fetch(`${API_BASE_URL}login/manager/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // include cookies in requests
      });
      console.log('Login response status:', loginResponse.status);

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        console.error('Login error:', errorData);
        return thunkAPI.rejectWithValue(errorData.error || 'Login failed');
      }

      // Fetch profile after successful login
      const profileResponse = await fetch(`${API_BASE_URL}profile/`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log('Profile response status:', profileResponse.status);

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        console.error('Profile fetch error:', errorData);
        return thunkAPI.rejectWithValue(errorData.error || 'Failed to fetch profile');
      }
      const profileData = await profileResponse.json();
      console.log('Profile data:', profileData);
      return profileData as UserProfile;
    } catch (error: any) {
      console.error('Login thunk caught error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for manager logout with debugging logs
export const logoutManager = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutManager',
  async (_, thunkAPI) => {
    try {
      console.log('Attempting logout...');
      const logoutResponse = await fetch(`${API_BASE_URL}logout/`, {
        method: 'POST',
        credentials: 'include',
      });
      console.log('Logout response status:', logoutResponse.status);
      if (!logoutResponse.ok) {
        const errorData = await logoutResponse.json();
        console.error('Logout error:', errorData);
        return thunkAPI.rejectWithValue(errorData.error || 'Logout failed');
      }
    } catch (error: any) {
      console.error('Logout thunk caught error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk to refresh tokens and update the profile with debugging logs
export const refreshToken = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>(
  'auth/refreshToken',
  async (_, thunkAPI) => {
    try {
      console.log('Attempting token refresh...');
      const refreshResponse = await fetch(`${API_BASE_URL}refresh/`, {
        method: 'POST',
        credentials: 'include',
      });
      console.log('Refresh response status:', refreshResponse.status);
      if (!refreshResponse.ok) {
        const errorData = await refreshResponse.json();
        console.error('Refresh token error:', errorData);
        return thunkAPI.rejectWithValue(errorData.error || 'Token refresh failed');
      }

      // Fetch profile after refreshing token
      const profileResponse = await fetch(`${API_BASE_URL}profile/`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log('Profile after refresh status:', profileResponse.status);
      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        console.error('Profile fetch error after refresh:', errorData);
        return thunkAPI.rejectWithValue(errorData.error || 'Failed to fetch profile after token refresh');
      }

      const profileData = await profileResponse.json();
      console.log('Profile data after token refresh:', profileData);
      return profileData as UserProfile;
    } catch (error: any) {
      console.error('Refresh token thunk caught error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Manually reset authentication state (if needed)
    resetAuthState(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    // Manually set the user data
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
