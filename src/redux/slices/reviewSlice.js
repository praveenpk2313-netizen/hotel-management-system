import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const getReviews = createAsyncThunk('reviews/getReviews', async (hotelId, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchHotelReviews(hotelId);
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getReviewByBooking = createAsyncThunk('reviews/getReviewByBooking', async (bookingId, { rejectWithValue }) => {
  try {
    const { data } = await api.fetchReviewByBookingId(bookingId);
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const submitReview = createAsyncThunk('reviews/submitReview', async (reviewData, { rejectWithValue }) => {
  try {
    const { data } = await api.addReview(reviewData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const editReview = createAsyncThunk('reviews/editReview', async ({ id, data: reviewData }, { rejectWithValue }) => {
  try {
    const { data } = await api.updateReview(id, reviewData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const removeReview = createAsyncThunk('reviews/removeReview', async (id, { rejectWithValue }) => {
  try {
    await api.deleteReview(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const submitReply = createAsyncThunk('reviews/submitReply', async ({ id, reply }, { rejectWithValue }) => {
  try {
    const { data } = await api.replyToReview(id, reply);
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetReviewStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(getReviewByBooking.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r._id === action.payload._id);
        if (index === -1) {
          state.reviews.push(action.payload);
        } else {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
        state.success = true;
      })
      .addCase(editReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(removeReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
        state.success = true;
      })
      .addCase(submitReply.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addMatcher(
        (action) => action.type.startsWith('reviews/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('reviews/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || 'Action failed. Please try again.';
        }
      );
  },
});

export const { resetReviewStatus } = reviewSlice.actions;
export default reviewSlice.reducer;
