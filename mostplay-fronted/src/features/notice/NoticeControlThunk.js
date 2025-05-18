import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL } from "../../utils/baseURL";

export const getNotices = createAsyncThunk(
  'noticeControl/getNotices',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${baseURL}/notice`, {
        method: 'GET',
      });

      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse?.data?.[0];
      } else {
        return rejectWithValue(dataResponse.message || 'Failed to fetch notices');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

