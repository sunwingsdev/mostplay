import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseURL } from '../../utils/baseURL';

// Thunk to fetch theme configuration from the database
export const fetchThemeConfig = createAsyncThunk(
  'theme/fetchThemeConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseURL}/admin-home-control`);
      if (!response.ok) {
        throw new Error('Failed to fetch theme configuration');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  primaryColor: '#194298',
  secondaryColor: '#F7B704',
  whiteColor: '#FFFFFF',
  sidebarHeaderColor: '#1C2937',
  sidebarBodyColor: '#34495E',
  sidebarTitle: 'Admin',
  sidebarTitleBD: 'অ্যাডমিন বিডি',
  websiteTitle: 'My Website',
  favicon: '',
  websiteLogoWhite: '',
  websiteLogoDark: '',
  logoLink: '/',
  language: 'en',
  country: 'en',
  loading: false,
  error: null,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
    },
    setSecondaryColor: (state, action) => {
      state.secondaryColor = action.payload;
    },
    setWhiteColor: (state, action) => {
      state.whiteColor = action.payload;
    },
    setSidebarHeaderColor: (state, action) => {
      state.sidebarHeaderColor = action.payload;
    },
    setSidebarBodyColor: (state, action) => {
      state.sidebarBodyColor = action.payload;
    },
    setSidebarTitle: (state, action) => {
      state.sidebarTitle = action.payload;
    },
    setSidebarTitleBD: (state, action) => {
      state.sidebarTitleBD = action.payload;
    },
    setWebsiteTitle: (state, action) => {
      state.websiteTitle = action.payload;
    },
    setFavicon: (state, action) => {
      state.favicon = action.payload;
    },
    setWebsiteLogoWhite: (state, action) => {
      state.websiteLogoWhite = action.payload;
    },
    setWebsiteLogoDark: (state, action) => {
      state.websiteLogoDark = action.payload;
    },
    setLogoLink: (state, action) => {
      state.logoLink = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemeConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThemeConfig.fulfilled, (state, action) => {
        // Update state with database values, fallback to defaults if not provided
        state.primaryColor = action.payload.primaryColor || state.primaryColor;
        state.secondaryColor = action.payload.secondaryColor || state.secondaryColor;
        state.sidebarHeaderColor = action.payload.sidebarHeaderColor || state.sidebarHeaderColor;
        state.sidebarBodyColor = action.payload.sidebarBodyColor || state.sidebarBodyColor;
        state.sidebarTitle = action.payload.sidebarTitle || state.sidebarTitle;
        state.sidebarTitleBD = action.payload.sidebarTitleBD || state.sidebarTitleBD;
        state.websiteTitle = action.payload.websiteTitle || state.websiteTitle;
        state.favicon = action.payload.favicon || state.favicon;
        state.websiteLogoWhite = action.payload.websiteLogoWhite || state.websiteLogoWhite;
        state.websiteLogoDark = action.payload.websiteLogoDark || state.websiteLogoDark;
        // Fields not in database, retain defaults
        state.whiteColor = state.whiteColor;
        state.logoLink = state.logoLink;
        state.language = state.language;
        state.country = state.country;
        state.loading = false;
      })
      .addCase(fetchThemeConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setPrimaryColor,
  setSecondaryColor,
  setWhiteColor,
  setSidebarHeaderColor,
  setSidebarBodyColor,
  setSidebarTitle,
  setSidebarTitleBD,
  setWebsiteTitle,
  setFavicon,
  setWebsiteLogoWhite,
  setWebsiteLogoDark,
  setLogoLink,
  setLanguage,
  setCountry,
} = themeSlice.actions;

export default themeSlice.reducer;