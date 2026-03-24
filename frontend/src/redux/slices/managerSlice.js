import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const getManagerStats = createAsyncThunk('manager/getStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchManagerStats();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Network error — could not fetch stats' });
  }
});

export const getManagerAnalytics = createAsyncThunk('manager/getAnalytics', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchManagerAnalytics();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Network error — could not fetch analytics' });
  }
});

const managerSlice = createSlice({
  name: 'manager',
  initialState: {
    stats: null,
    analytics: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearManagerError: (state) => {
      state.error = null;
    },
    clearManagerData: (state) => {
      state.stats = null;
      state.analytics = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Force clear stats on logout to prevent cross-account leakage
      .addCase('auth/logout', (state) => {
        state.stats = null;
        state.analytics = [];
        state.loading = false;
        state.error = null;
      })
      .addCase(getManagerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getManagerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getManagerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch manager stats';
      })
      .addCase(getManagerAnalytics.pending, (state) => {
        // Analytics can load in background
      })
      .addCase(getManagerAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      .addCase(getManagerAnalytics.rejected, (state, action) => {
        console.warn('Analytics fetch failed:', action.payload?.message);
      });
  },
});

export const { clearManagerError, clearManagerData } = managerSlice.actions;
export default managerSlice.reducer;
