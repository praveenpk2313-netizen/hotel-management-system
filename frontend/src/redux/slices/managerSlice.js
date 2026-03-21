import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const getManagerStats = createAsyncThunk('manager/getStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchManagerStats();
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getManagerAnalytics = createAsyncThunk('manager/getAnalytics', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchManagerAnalytics();
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getManagerStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getManagerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getManagerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch manager stats';
      })
      .addCase(getManagerAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export const { clearManagerError } = managerSlice.actions;
export default managerSlice.reducer;
