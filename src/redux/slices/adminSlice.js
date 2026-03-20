import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// --- Thunks ---

export const getAdminStats = createAsyncThunk('admin/getStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchAdminStats();
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getAdminUsers = createAsyncThunk('admin/getUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchAdminUsers();
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getAdminHotels = createAsyncThunk('admin/getHotels', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchAdminHotels();
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getAdminBookings = createAsyncThunk('admin/getBookings', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchAdminBookings();
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getAdminPayments = createAsyncThunk('admin/getPayments', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchAdminPayments();
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getAdminReviews = createAsyncThunk('admin/getReviews', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchAdminReviews();
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// --- Action Thunks ---

export const deleteUserAdmin = createAsyncThunk('admin/deleteUser', async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.deleteAdminUser(id);
    dispatch(getAdminUsers());
    dispatch(getAdminStats());
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const blockUserAdmin = createAsyncThunk('admin/blockUser', async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.toggleBlockUser(id);
    dispatch(getAdminUsers());
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const changeUserRoleAdmin = createAsyncThunk('admin/changeRole', async ({ id, role }, { dispatch, rejectWithValue }) => {
  try {
    await api.updateAdminUserRole(id, role);
    dispatch(getAdminUsers());
    dispatch(getAdminStats());
    return { id, role };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateHotelStatusAdmin = createAsyncThunk('admin/updateHotelStatus', async ({ id, status }, { dispatch, rejectWithValue }) => {
  try {
    await api.updateAdminHotelStatus(id, status);
    dispatch(getAdminHotels());
    dispatch(getAdminStats());
    return { id, status };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteHotelAdmin = createAsyncThunk('admin/deleteHotel', async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.deleteAdminHotel(id);
    dispatch(getAdminHotels());
    dispatch(getAdminStats());
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const cancelBookingAdmin = createAsyncThunk('admin/cancelBooking', async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.cancelAdminBooking(id);
    dispatch(getAdminBookings());
    dispatch(getAdminStats());
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteReviewAdmin = createAsyncThunk('admin/deleteReview', async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.deleteAdminReview(id);
    dispatch(getAdminReviews());
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const initialState = {
  stats: null,
  users: [],
  hotels: [],
  bookings: [],
  payments: [],
  reviews: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Success fulfillers
      .addCase(getAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAdminHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(getAdminBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getAdminPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getAdminReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      // General matchers for loading/error
      .addMatcher(
        (action) => action.type.startsWith('admin/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('admin/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || 'Something went wrong';
        }
      );
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
