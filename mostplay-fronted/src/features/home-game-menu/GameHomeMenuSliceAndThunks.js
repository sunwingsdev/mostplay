import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseURL } from '../../utils/baseURL';

export const fetchHomeGameMenu = createAsyncThunk(
  'homeGameMenu/fetchHomeGameMenu',
  async (_, { rejectWithValue }) => {
    try {
        
      const response = await fetch(`${baseURL}/game-nav-menu`);
     
      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse?.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Failed to fetch carousel');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Error fetching home game menu');
    }
  }
);

const homeGameMenuSlice = createSlice({
  name: 'homeGameMenu',
  initialState: {
    homeGameMenu: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {
    setHomeGameMenu(state, action) {
      state.homeGameMenu = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeGameMenu.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchHomeGameMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.homeGameMenu = action.payload;
      })
      .addCase(fetchHomeGameMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export const { setHomeGameMenu } = homeGameMenuSlice.actions;
export default homeGameMenuSlice.reducer;

