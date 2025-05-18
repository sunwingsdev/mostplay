import { createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching theme configuration
export const fetchThemeConfig = createAsyncThunk(
  "theme/fetchThemeConfig",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://your-api.com/api/theme-config");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

