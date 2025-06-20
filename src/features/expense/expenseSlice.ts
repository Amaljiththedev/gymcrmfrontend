import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "@/lib/axios";

/* ------------------------------------------------------------------ */
/* 🔖 Types                                                            */
/* ------------------------------------------------------------------ */
export interface Expense {
  id: number;
  title: string;
  amount: string;
  category: string;
  description: string | null;
  date: string; // YYYY‑MM‑DD
  expense_source: string;
  created_at: string;
}

export interface Choice {
  value: string;
  label: string;
}

interface ExpenseState {
  expenses: Expense[];
  categories: Choice[];
  sources: Choice[];
  loading: boolean;
  metaLoading: boolean;
  exportLoading: boolean;
  error: string | null;
  exportError: string | null;

  currentExpense: Expense | null;
  currentLoading: boolean;
  currentError: string | null;
}

/* ------------------------------------------------------------------ */
/* 🔖 Initial State                                                   */
/* ------------------------------------------------------------------ */
const initialState: ExpenseState = {
  expenses: [],
  categories: [],
  sources: [],
  loading: false,
  metaLoading: false,
  exportLoading: false,
  error: null,
  exportError: null,

  currentExpense: null,
  currentLoading: false,
  currentError: null,
};

/* ------------------------------------------------------------------ */
/* 🔖 Thunks                                                           */
/* ------------------------------------------------------------------ */

/** GET /expenses/ → fetch all expenses */
export const fetchExpenses = createAsyncThunk<
  Expense[],
  void,
  { rejectValue: string }
>("expense/fetchExpenses", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<Expense[]>('/expenses/');
    return data;
  } catch (err) {
    const e = err as AxiosError;
    return rejectWithValue(
      (e.response?.data as any)?.detail ?? e.message ?? 'Failed to fetch expenses'
    );
  }
});

/** POST /expenses/ → create a new expense */
export const createExpense = createAsyncThunk<
  Expense,
  Omit<Expense, 'id' | 'created_at'>,
  { rejectValue: string }
>("expense/createExpense", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<Expense>('/expenses/', payload);
    return data;
  } catch (err) {
    const e = err as AxiosError;
    return rejectWithValue(
      (e.response?.data as any)?.detail ?? e.message ?? 'Failed to create expense'
    );
  }
});

/** GET /expensesources/ → fetch meta data: categories & sources */
export const fetchExpenseMeta = createAsyncThunk<
  { categories: Choice[]; sources: Choice[] },
  void,
  { rejectValue: string }
>("expense/fetchExpenseMeta", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/expensesources/');
    return data;
  } catch (err) {
    const e = err as AxiosError;
    return rejectWithValue(
      (e.response?.data as any)?.detail ?? e.message ?? 'Failed to load meta data'
    );
  }
});

/** GET /export/ → export expenses to an Excel file */
export const exportExpenses = createAsyncThunk<
  void,
  {
    category?: string;
    source?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
    ordering?: string;
  },
  { rejectValue: string }
>(
  "expense/exportExpenses",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/export/', {
        params,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    } catch (err) {
      const e = err as AxiosError;
      return rejectWithValue(
        (e.response?.data as any)?.detail ?? e.message ?? 'Failed to export expenses'
      );
    }
  }
);

/** GET /expenses/:id/ → fetch single expense by ID */
export const fetchExpenseById = createAsyncThunk<
  Expense,
  number,
  { rejectValue: string }
>(
  "expense/fetchExpenseById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Expense>(`/expenses/${id}/`);
      return data;
    } catch (err) {
      const e = err as AxiosError;
      return rejectWithValue(
        (e.response?.data as any)?.detail ?? e.message ?? 'Failed to fetch expense'
      );
    }
  }
);

/* ------------------------------------------------------------------ */
/* 🔖 Slice                                                            */
/* ------------------------------------------------------------------ */
const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearExpenseError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchExpenses
    builder.addCase(fetchExpenses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchExpenses.fulfilled, (state, action: PayloadAction<Expense[]>) => {
      state.loading = false;
      state.expenses = action.payload;
    });
    builder.addCase(fetchExpenses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch expenses';
    });

    // createExpense
    builder.addCase(createExpense.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
      state.loading = false;
      state.expenses.unshift(action.payload);
    });
    builder.addCase(createExpense.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to create expense';
    });

    // fetchExpenseMeta
    builder.addCase(fetchExpenseMeta.pending, (state) => {
      state.metaLoading = true;
    });
    builder.addCase(
      fetchExpenseMeta.fulfilled,
      (state, action: PayloadAction<{ categories: Choice[]; sources: Choice[] }>) => {
        state.metaLoading = false;
        state.categories = action.payload.categories;
        state.sources = action.payload.sources;
      }
    );
    builder.addCase(fetchExpenseMeta.rejected, (state) => {
      state.metaLoading = false;
    });

    // exportExpenses
    builder.addCase(exportExpenses.pending, (state) => {
      state.exportLoading = true;
      state.exportError = null;
    });
    builder.addCase(exportExpenses.fulfilled, (state) => {
      state.exportLoading = false;
    });
    builder.addCase(exportExpenses.rejected, (state, action) => {
      state.exportLoading = false;
      state.exportError = action.payload ?? 'Failed to export expenses';
    });

    // fetchExpenseById
    builder.addCase(fetchExpenseById.pending, (state) => {
      state.currentLoading = true;
      state.currentError = null;
    });
    builder.addCase(fetchExpenseById.fulfilled, (state, action: PayloadAction<Expense>) => {
      state.currentLoading = false;
      state.currentExpense = action.payload;
    });
    builder.addCase(fetchExpenseById.rejected, (state, action) => {
      state.currentLoading = false;
      state.currentError = action.payload ?? 'Failed to fetch expense';
    });
  },
});

export const { clearExpenseError } = expenseSlice.actions;
export default expenseSlice.reducer;
