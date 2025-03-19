// staffSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Set the base API URL and include credentials
const API_BASE_URL = "http://localhost:8000/api";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Define the Staff interface
export interface Staff {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  department: string;
  salary: string;
  salary_credited_day: number;
  role: string;
}

// Define the state interface for the staff slice
interface StaffState {
  all: Staff[];
  detail: Staff | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  addLoading: boolean;
  addError: string | null;
}

// Initial state
const initialState: StaffState = {
  all: [],
  detail: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  addLoading: false,
  addError: null,
};

// Async thunk for fetching all staff members (regular + super)
export const fetchAllStaff = createAsyncThunk<Staff[], void>(
  'staff/fetchAllStaff',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Staff[]>('/staff/all-staff/');
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for fetching a single staff member's details by ID
export const fetchStaffDetail = createAsyncThunk<Staff, number>(
  'staff/fetchStaffDetail',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get<Staff>(`/staff/staff-detail/${id}/`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for updating a staff member by ID (using PATCH for partial updates)
export const updateStaff = createAsyncThunk<Staff, { id: number; staffData: Partial<Staff> }>(
  'staff/updateStaff',
  async ({ id, staffData }, thunkAPI) => {
    try {
      const response = await axios.patch<Staff>(`/staff/staff-detail/${id}/`, staffData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for adding Regular Staff (no password required)
export const addRegularStaff = createAsyncThunk<Staff, Omit<Staff, 'id' | 'role'>>(
  'staff/addRegularStaff',
  async (staffData, thunkAPI) => {
    try {
      const response = await axios.post<Staff>('/staff/regular-staff/', staffData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for adding Super Staff (requires a password)
export const addSuperStaff = createAsyncThunk<
  Staff,
  Omit<Staff, 'id' | 'role'> & { password: string }
>(
  'staff/addSuperStaff',
  async (staffData, thunkAPI) => {
    try {
      const response = await axios.post<Staff>('/staff/super-staff/', staffData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create the staff slice
const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchAllStaff
    builder.addCase(fetchAllStaff.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllStaff.fulfilled, (state, action: PayloadAction<Staff[]>) => {
      state.loading = false;
      state.all = action.payload;
    });
    builder.addCase(fetchAllStaff.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Handle fetchStaffDetail
    builder.addCase(fetchStaffDetail.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.detail = null;
    });
    builder.addCase(fetchStaffDetail.fulfilled, (state, action: PayloadAction<Staff>) => {
      state.loading = false;
      state.detail = action.payload;
    });
    builder.addCase(fetchStaffDetail.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Handle updateStaff
    builder.addCase(updateStaff.pending, (state) => {
      state.updateLoading = true;
      state.updateError = null;
    });
    builder.addCase(updateStaff.fulfilled, (state, action: PayloadAction<Staff>) => {
      state.updateLoading = false;
      state.detail = action.payload;
    });
    builder.addCase(updateStaff.rejected, (state, action: PayloadAction<any>) => {
      state.updateLoading = false;
      state.updateError = action.payload;
    });
    // Handle addRegularStaff
    builder.addCase(addRegularStaff.pending, (state) => {
      state.addLoading = true;
      state.addError = null;
    });
    builder.addCase(addRegularStaff.fulfilled, (state, action: PayloadAction<Staff>) => {
      state.addLoading = false;
      state.all.push(action.payload);
    });
    builder.addCase(addRegularStaff.rejected, (state, action: PayloadAction<any>) => {
      state.addLoading = false;
      state.addError = action.payload;
    });
    // Handle addSuperStaff
    builder.addCase(addSuperStaff.pending, (state) => {
      state.addLoading = true;
      state.addError = null;
    });
    builder.addCase(addSuperStaff.fulfilled, (state, action: PayloadAction<Staff>) => {
      state.addLoading = false;
      state.all.push(action.payload);
    });
    builder.addCase(addSuperStaff.rejected, (state, action: PayloadAction<any>) => {
      state.addLoading = false;
      state.addError = action.payload;
    });
  },
});

export default staffSlice.reducer;
