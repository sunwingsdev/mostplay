import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL } from "../../utils/baseURL";


export const getCarouselImages = createAsyncThunk(
  'carouselControl/getCarouselImages',
  async (_, { getState, rejectWithValue }) => {
    try {


      const response = await fetch(`${baseURL}/homeCarousel`, {
        method: 'GET',
      });

      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Failed to fetch carousel');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

