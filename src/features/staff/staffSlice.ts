/* ------------------------------------------------------------------ */
/*  src/features/staff/staffSlice.ts                                   */
/* ------------------------------------------------------------------ */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

/* 📌 API setup ------------------------------------------------------ */
const API_BASE_URL = "http://localhost:8000/api";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

/* 📦 Types ---------------------------------------------------------- */
export interface Staff {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  department: string;
  salary: string;
  salary_credited_date: string;
  salary_due_date: string;
  photo: string;
  role: string;
}

export interface SuperStaffFormInput {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  department: string;
  salary: string;
  salary_credited_date: string;
  salary_due_date: string;
  photo: File;
  password: string;
}

export const toSuperStaffFormData = (input: SuperStaffFormInput): FormData => {
  const formData = new FormData();
  Object.entries(input).forEach(([k, v]) => formData.append(k, v as any));
  return formData;
};

/* 🧠 State ---------------------------------------------------------- */
interface StaffState {
  all: Staff[];
  superStaff: Staff[];
  regularStaff: Staff[];
  detail: Staff | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  addLoading: boolean;
  addError: string | null;
}

const initialState: StaffState = {
  all: [],
  superStaff: [],
  regularStaff: [],
  detail: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  addLoading: false,
  addError: null,
};

/* 🔁 Utility -------------------------------------------------------- */
const getErrorMessage = (err: any) => {
  const data = err.response?.data;
  return data && Object.keys(data).length === 0 ? err.message : data || err.message;
};

/* ✅ Thunks --------------------------------------------------------- */
export const fetchAllStaff = createAsyncThunk<Staff[]>(
  "staff/fetchAllStaff",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get<Staff[]>("/staff/");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchSuperStaff = createAsyncThunk<Staff[]>(
  "staff/fetchSuperStaff",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get<Staff[]>("/super-staff/");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchRegularStaff = createAsyncThunk<Staff[]>(
  "staff/fetchRegularStaff",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get<Staff[]>("/regular-staff/");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

/* 🔥  FIXED ENDPOINT =>  /staff/<id>/ ------------------------------ */
export const fetchStaffDetail = createAsyncThunk<Staff, number>(
  "staff/fetchStaffDetail",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get<Staff>(`/staff/${id}/`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

export const updateStaff = createAsyncThunk<
  Staff,
  { id: number; staffData: Partial<Staff> }
>("staff/updateStaff", async ({ id, staffData }, thunkAPI) => {
  try {
    const res = await axios.patch<Staff>(`/staff/${id}/`, staffData);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const addRegularStaff = createAsyncThunk<
  Staff,
  Omit<Staff, "id" | "role">
>("staff/addRegularStaff", async (data, thunkAPI) => {
  try {
    const res = await axios.post<Staff>("/regular-staff/", data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const addSuperStaff = createAsyncThunk<Staff, FormData>(
  "staff/addSuperStaff",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post<Staff>("/super-staff/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

/* 🧩 Slice --------------------------------------------------------- */
const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    resetErrors: (s) => {
      s.error = s.addError = s.updateError = null;
    },
    clearDetail: (s) => {
      s.detail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ----- All -------------------------------------------------- */
      .addCase(fetchAllStaff.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchAllStaff.fulfilled, (s, a: PayloadAction<Staff[]>) => {
        s.loading = false;
        s.all = a.payload;
      })
      .addCase(fetchAllStaff.rejected, (s, a: PayloadAction<any>) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ----- Super ------------------------------------------------ */
      .addCase(fetchSuperStaff.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchSuperStaff.fulfilled, (s, a: PayloadAction<Staff[]>) => {
        s.loading = false;
        s.superStaff = a.payload;
      })
      .addCase(fetchSuperStaff.rejected, (s, a: PayloadAction<any>) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ----- Regular ---------------------------------------------- */
      .addCase(fetchRegularStaff.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchRegularStaff.fulfilled, (s, a: PayloadAction<Staff[]>) => {
        s.loading = false;
        s.regularStaff = a.payload;
      })
      .addCase(fetchRegularStaff.rejected, (s, a: PayloadAction<any>) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ----- Detail ----------------------------------------------- */
      .addCase(fetchStaffDetail.pending, (s) => {
        s.loading = true;
        s.detail = null;
      })
      .addCase(fetchStaffDetail.fulfilled, (s, a: PayloadAction<Staff>) => {
        s.loading = false;
        s.detail = a.payload;
      })
      .addCase(fetchStaffDetail.rejected, (s, a: PayloadAction<any>) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ----- Update  (sync lists) --------------------------------- */
      .addCase(updateStaff.pending, (s) => {
        s.updateLoading = true;
        s.updateError = null;
      })
      .addCase(updateStaff.fulfilled, (s, a: PayloadAction<Staff>) => {
        s.updateLoading = false;
        s.detail = a.payload;

        const replace = (list: Staff[]) => {
          const idx = list.findIndex((x) => x.id === a.payload.id);
          if (idx !== -1) list[idx] = a.payload;
        };
        replace(s.all);
        replace(s.superStaff);
        replace(s.regularStaff);
      })
      .addCase(updateStaff.rejected, (s, a: PayloadAction<any>) => {
        s.updateLoading = false;
        s.updateError = a.payload;
      })

      /* ----- Add regular ------------------------------------------ */
      .addCase(addRegularStaff.pending, (s) => {
        s.addLoading = true;
        s.addError = null;
      })
      .addCase(addRegularStaff.fulfilled, (s, a: PayloadAction<Staff>) => {
        s.addLoading = false;
        s.regularStaff.push(a.payload);
      })
      .addCase(addRegularStaff.rejected, (s, a: PayloadAction<any>) => {
        s.addLoading = false;
        s.addError = a.payload;
      })

      /* ----- Add super -------------------------------------------- */
      .addCase(addSuperStaff.pending, (s) => {
        s.addLoading = true;
        s.addError = null;
      })
      .addCase(addSuperStaff.fulfilled, (s, a: PayloadAction<Staff>) => {
        s.addLoading = false;
        s.superStaff.push(a.payload);
      })
      .addCase(addSuperStaff.rejected, (s, a: PayloadAction<any>) => {
        s.addLoading = false;
        s.addError = a.payload;
      });
  },
});

/* 📤 Exports -------------------------------------------------------- */
export const { resetErrors, clearDetail } = staffSlice.actions;
export default staffSlice.reducer;
