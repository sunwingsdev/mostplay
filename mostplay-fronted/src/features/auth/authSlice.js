import { createSlice } from "@reduxjs/toolkit";
import { loginUser, signupUser, checkToken, updateBirthday, getBalance } from "./authThunks";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  loading: false,
  error: null,
  currency: "BDT",
  tokenLoading: false,
  balanceLoading: false,
  balanceError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    checkTokenStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    checkTokenSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.otp = action.payload.otp;
    },
    checkTokenFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateBirthdayStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateBirthdaySuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
    },
    updateBirthdayFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.email = action.payload.email;
        state.otp = action.payload.otp;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkToken.pending, (state) => {
        state.tokenLoading = true;
        state.error = null;
      })
      .addCase(checkToken.rejected, (state, action) => {
        state.tokenLoading = false;
        state.error = action.payload;
      })
      .addCase(checkToken.fulfilled, (state, action) => {
        state.tokenLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(updateBirthday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBirthday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBirthday.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getBalance.pending, (state) => {
        state.balanceLoading = true;
        state.balanceError = null;
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.balanceLoading = false;
        state.balanceError = action.payload;
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.balanceLoading = false;
        state.user = {...state.user, balance: action?.payload};
      });
  },
});
export const { logout, clearError, setCurrency, updateBirthdayStart, updateBirthdaySuccess, updateBirthdayFailure, updateUser } = authSlice.actions;
export default authSlice.reducer;

