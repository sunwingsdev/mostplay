import { createSlice } from '@reduxjs/toolkit';
import { getNotices } from './NoticeControlThunk';

const initialState = {
  _id: "",
  title: "",
  titleBD: "",
  emoji: "",
  active: true,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
  successMessage: "",
};

const noticeControlSlice = createSlice({
  name: 'noticeControl',
  initialState,
  reducers: {
    setNotices(state, action) {
      state._id = action.payload?._id;
      state.title = action.payload?.title;
      state.titleBD = action.payload?.titleBD;
      state.emoji = action.payload?.emoji;
      state.active = action.payload?.active;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.isError = action.payload.isError;
      state.errorMessage = action.payload.errorMessage;
    },
    setSuccess(state, action) {
      state.isSuccess = action.payload.isSuccess;
      state.successMessage = action.payload.successMessage;
    },
    resetState(state) {
      state._id = "";
      state.title = "";
      state.titleBD = "";
      state.emoji = "";
      state.active = true;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
      state.isSuccess = false;
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state._id = action.payload?._id;
        state.title = action.payload?.title;
        state.titleBD = action.payload?.titleBD;
        state.emoji = action.payload?.emoji;
        state.active = action.payload?.active;
      })
      .addCase(getNotices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export const { setNotices, setLoading, setError, setSuccess, resetState } = noticeControlSlice.actions;
export default noticeControlSlice.reducer;

