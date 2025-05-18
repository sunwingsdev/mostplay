import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGames } from "./GameControlAPI";

const gameControlSlice = createSlice({
  name: 'gameControl',
  initialState: {
    gameControl: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
    successMessage: '',
  },
  reducers: {
    setGameControl(state, action) {
      state.gameControl = action.payload;
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.errorMessage = '';
      state.successMessage = 'Game control fetched successfully';
    },
    setGameControlLoading(state) {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
      state.successMessage = '';
    },
    setGameControlError(state, action) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.errorMessage = action.payload;
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.gameControl = action.payload;
        state.successMessage = 'Game control fetched successfully';
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
        state.successMessage = '';
      });
  },
});

export const { setGameControl, setGameControlLoading, setGameControlError } = gameControlSlice.actions;
export default gameControlSlice.reducer;

