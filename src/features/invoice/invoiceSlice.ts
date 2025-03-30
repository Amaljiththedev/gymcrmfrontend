// src/features/invoice/invoiceSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_BASE_URL = "http://localhost:8000/api"; // Ensure this matches your cookie domain

export interface InvoiceState {
  invoiceUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  invoiceUrl: null,
  loading: false,
  error: null,
};

export const downloadInvoice = createAsyncThunk<
  string, // return invoice URL (blob URL)
  { memberId: number; invoiceId: number }, // parameters
  { rejectValue: string }
>(
  "invoice/downloadInvoice",
  async ({ memberId, invoiceId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/invoice/${memberId}/${invoiceId}/`,
        {
          method: "GET",
          credentials: "include", // send HTTP‑only cookies
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const invoiceUrl = URL.createObjectURL(blob);
      return invoiceUrl;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to download invoice");
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    clearInvoice: (state) => {
      if (state.invoiceUrl) {
        URL.revokeObjectURL(state.invoiceUrl);
      }
      state.invoiceUrl = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(downloadInvoice.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.invoiceUrl = null;
    });
    builder.addCase(
      downloadInvoice.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.invoiceUrl = action.payload;
      }
    );
    builder.addCase(downloadInvoice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to download invoice";
    });
  },
});

export const { clearInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
