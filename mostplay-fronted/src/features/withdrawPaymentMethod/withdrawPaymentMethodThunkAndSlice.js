import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { baseURL } from './../../utils/baseURL';

// Thunk to fetch withdraw payment methods
export const getWithdrawPaymentMethods = createAsyncThunk(
  'withdrawPaymentMethod/getWithdrawPaymentMethods',
  async () => {
    try {
      const response = await fetch(`${baseURL}/withdraw-payment-method`);
      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse.data;
      } else {
        return Promise.reject(dataResponse.message || 'Failed to fetch withdraw payment methods');
      }
    } catch (err) {
      return Promise.reject(err.message || 'Network error');
    }
  }
);

// Thunk to save withdraw request
export const saveWithdrawRequest = createAsyncThunk(
  'withdrawPaymentMethod/saveWithdrawRequest',
  async (withdrawData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseURL}/withdraw-payment-transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(withdrawData),
      });
      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Failed to save withdrawal request');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const withdrawPaymentMethodSlice = createSlice({
  name: 'withdrawPaymentMethod',
  initialState: {
    withdrawPaymentMethods: [],
    isLoading: false,
    error: null,
    withdrawRequestLoading: false,
    withdrawRequestSuccess: false,
    withdrawRequestError: null,
  },
  reducers: {
    resetWithdrawRequestState: (state) => {
      state.withdrawRequestLoading = false;
      state.withdrawRequestSuccess = false;
      state.withdrawRequestError = null;
    },
  },
  extraReducers: (builder) => {
    // Handle getWithdrawPaymentMethods
    builder
      .addCase(getWithdrawPaymentMethods.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWithdrawPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawPaymentMethods = action.payload;
      })
      .addCase(getWithdrawPaymentMethods.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle saveWithdrawRequest
      .addCase(saveWithdrawRequest.pending, (state) => {
        state.withdrawRequestLoading = true;
        state.withdrawRequestSuccess = false;
        state.withdrawRequestError = null;
      })
      .addCase(saveWithdrawRequest.fulfilled, (state, action) => {
        state.withdrawRequestLoading = false;
        state.withdrawRequestSuccess = true;
        state.withdrawRequestError = null;
      })
      .addCase(saveWithdrawRequest.rejected, (state, action) => {
        state.withdrawRequestLoading = false;
        state.withdrawRequestSuccess = false;
        state.withdrawRequestError = action.payload;
      });
  },
});

export const { resetWithdrawRequestState } = withdrawPaymentMethodSlice.actions;
export default withdrawPaymentMethodSlice.reducer;