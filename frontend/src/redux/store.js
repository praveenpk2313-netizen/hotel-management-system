import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import managerReducer from './slices/managerSlice';
import reviewReducer from './slices/reviewSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    manager: managerReducer,
    reviews: reviewReducer,
    notifications: notificationReducer,
  },
});

export default store;
