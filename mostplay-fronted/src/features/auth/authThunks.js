import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL } from './../../utils/baseURL';

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue,dispatch }) => {
    try {
      const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const responseData = await response.json();

      if (response.ok) {

       // console.log(responseData);

        const { token, user } = responseData.data;
        
        localStorage.setItem('token', token);

       // dispatch(loginUser.fulfilled({ token, user }))

        return { token, user };

      } else {
        return rejectWithValue(responseData.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Async thunk for user signup
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (credentials, { rejectWithValue, dispatch, fulfillWithCurrentValue }) => {
    try {
      const response = await fetch(`${baseURL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const responseData = await response.json();

      if (response.ok) {

     //   console.log(responseData);

        const { token, user } = responseData.data;
        
        localStorage.setItem('token', token);

      //  dispatch(loginUser.fulfilled({ token, user }))

        return { token, user };

      } else {
        return rejectWithValue(responseData.message);
      }

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




export const checkToken = createAsyncThunk(
  "auth/checkToken",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Token not found");

    try {
      const response = await fetch(`${baseURL}/check-token`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        const { user, token: newToken } = responseData.data;
        localStorage.setItem('token', newToken);

        return { user, token: newToken };
      } else {
        return rejectWithValue("Invalid token");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const getBalance = createAsyncThunk(
  "auth/getBalance",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Token not found");

    try {
      const userId = getState().auth.user._id;
      const response = await fetch(`${baseURL}/balance`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const responseData = await response.json();

      if (response.ok) {

        return responseData.data;
      } else {
        return rejectWithValue("Failed to get balance");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const updateBirthday = createAsyncThunk(
  "auth/updateBirthday",
  async ({ userId, birthday }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Token not found");

    try {
      const response = await fetch(`${baseURL}/update-birthday/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ birthday }),
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
