import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Set the base API URL and include credentials
const API_BASE_URL = "http://localhost:8000/api";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Define the Staff interface
export interface Staff {
  salary_due_date: string;  // Ensure this is a string, not a function
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
  superStaff: Staff[];
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
  superStaff: [],
  detail: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  addLoading: false,
  addError: null,
};

// Helper function to extract error message
const getErrorMessage = (error: any) => {
  const data = error.response?.data;
  if (data && Object.keys(data).length === 0) {
    return error.message;
  }
  return data || error.message;
};

// Async thunk for fetching all staff members
export const fetchAllStaff = createAsyncThunk<Staff[], void>(
  'staff/fetchAllStaff',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Staff[]>('/staff/all-staff/');
      console.log("All Staff Data:", response.data);
      return response.data;
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      console.error("Error fetching all staff:", errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// Async thunk for fetching super staff
export const fetchSuperstaff = createAsyncThunk<Staff[], void>(
  'staff/fetchSuperstaff',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Staff[]>('/staff/super-staff/');
      console.log("Super Staff Data:", response.data);
      return response.data;
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      console.error("Error fetching super staff:", errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// Async thunk for fetching regular staff
export const fetchRegularStaff = createAsyncThunk<Staff[], void>(
  'staff/fetchRegularStaff',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Staff[]>('/staff/regular-staff/');
      console.log("Regular Staff Data:", response.data);
      return response.data;
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      console.error("Error fetching regular staff:", errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// Async thunk for fetching a single staff member's details
export const fetchStaffDetail = createAsyncThunk<Staff, number>(
  'staff/fetchStaffDetail',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get<Staff>(`/staff/staff-detail/${id}/`);
      return response.data;
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// Async thunk for updating a staff member
export const updateStaff = createAsyncThunk<Staff, { id: number; staffData: Partial<Staff> }>(
  'staff/updateStaff',
  async ({ id, staffData }, thunkAPI) => {
    try {
      const response = await axios.patch<Staff>(`/staff/staff-detail/${id}/`, staffData);
      return response.data;
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// Async thunk for adding Regular Staff (expects a plain object)
export const addRegularStaff = createAsyncThunk<Staff, Omit<Staff, 'id' | 'role'>>(
  'staff/addRegularStaff',
  async (staffData, thunkAPI) => {
    try {
      const response = await axios.post<Staff>('/staff/regular-staff/', staffData);
      return response.data;
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// Async thunk for adding Super Staff (requires password)
// Now updated to accept a FormData instance so that files and text fields (including department) are supported.
export const addSuperStaff = createAsyncThunk<Staff, FormData>(
  'staff/addSuperStaff',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post<Staff>('/staff/super-staff/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      return thunkAPI.rejectWithValue(errorMsg);
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

    // Handle fetchSuperstaff
    builder.addCase(fetchSuperstaff.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSuperstaff.fulfilled, (state, action: PayloadAction<Staff[]>) => {
      state.loading = false;
      state.superStaff = action.payload;
      console.log("Updated State with Super Staff:", state.superStaff);
    });
    builder.addCase(fetchSuperstaff.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle fetchRegularStaff
    builder.addCase(fetchRegularStaff.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRegularStaff.fulfilled, (state, action: PayloadAction<Staff[]>) => {
      state.loading = false;
      state.all = action.payload;
      console.log("Updated State with Regular Staff:", state.all);
    });
    builder.addCase(fetchRegularStaff.rejected, (state, action: PayloadAction<any>) => {
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
      state.superStaff.push(action.payload);
    });
    builder.addCase(addSuperStaff.rejected, (state, action: PayloadAction<any>) => {
      state.addLoading = false;
      state.addError = action.payload;
    });
  },
});

export default staffSlice.reducer;
