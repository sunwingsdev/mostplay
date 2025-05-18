import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseURL } from '../../utils/baseURL';

export const fetchUserPaymentTransactions = createAsyncThunk(
  'transaction/fetchUserPaymentTransactions',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue('Token not found');

      const response = await fetch(`${baseURL}/payment-transactions/user/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        return responseData.data;
      } else {
        return rejectWithValue(responseData.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserWithdrawPaymentTransactions = createAsyncThunk(
  'transaction/fetchUserWithdrawPaymentTransactions',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue('Token not found');

      const response = await fetch(`${baseURL}/withdraw-payment-transactions/user/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        return responseData.data;
      } else {
        return rejectWithValue(responseData.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    paymentTransactions: [],
    withdrawTransactions: [],
    isLoading: false,
    isError: false,
    errorMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPaymentTransactions.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchUserPaymentTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentTransactions = action.payload;
      })
      .addCase(fetchUserPaymentTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(fetchUserWithdrawPaymentTransactions.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchUserWithdrawPaymentTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawTransactions = action.payload;
      })
      .addCase(fetchUserWithdrawPaymentTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer;