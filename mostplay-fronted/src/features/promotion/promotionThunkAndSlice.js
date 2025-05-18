import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { baseURL } from '../../utils/baseURL';

export const fetchPromotions = createAsyncThunk(
  'promotion/fetchPromotions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${baseURL}/promotions`, {
        method: 'GET',
      });
      const dataResponse = await response.json();
      if (response.ok) {
        return dataResponse?.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Failed to fetch promotions');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const promotionSlice = createSlice({
  name: 'promotion',
  initialState: {
    promotions: [],
    isLoading: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotions.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.promotions = action.payload;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default promotionSlice.reducer;

