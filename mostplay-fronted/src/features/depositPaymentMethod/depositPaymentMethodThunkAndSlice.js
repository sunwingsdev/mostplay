
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { baseURL } from './../../utils/baseURL';


export const getDepositPaymentMethods = createAsyncThunk(
  'depositPaymentMethod/getDepositPaymentMethods',
  async () => {
    try {
        
      const response = await fetch(`${baseURL}/deposit-payment-method`);
      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse.data;
      } else {
        return Promise.reject(dataResponse.message || 'Failed to fetch deposit payment methods');
      }
    } catch (err) {
      return Promise.reject(err.message || 'Network error');
    }
  }
);

const depositPaymentMethodSlice = createSlice({
  name: 'depositPaymentMethod',
  initialState: {
    depositPaymentMethods: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDepositPaymentMethods.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDepositPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.depositPaymentMethods = action.payload;
      })
      .addCase(getDepositPaymentMethods.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { depositPaymentMethods, isLoading, error } = depositPaymentMethodSlice.actions;

export default depositPaymentMethodSlice.reducer;
