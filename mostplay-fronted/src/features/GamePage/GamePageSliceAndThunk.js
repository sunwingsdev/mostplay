import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseURL } from '../../utils/baseURL';


// Thunk for fetching game section data
export const fetchGameSection = createAsyncThunk(
  'gameSection/fetchGameSection',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseURL}/game-section`);

      if (response.ok) {
        const dataResponse = await response.json();
        return dataResponse?.data;
      } else {
        const errorResponse = await response.json();
        return rejectWithValue(errorResponse.message || 'Failed to fetch carousel');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Error fetching game section data');
    }
  }
);

const gameSectionSlice = createSlice({
  name: 'gameSection',
  initialState: {
    data: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameSection.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchGameSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(fetchGameSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default gameSectionSlice.reducer;

