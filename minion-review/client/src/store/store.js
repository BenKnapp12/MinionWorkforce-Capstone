import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import { minionsApi } from '../api/minionsApi.js';
import { reviewsApi } from '../api/reviewsApi.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    [minionsApi.reducerPath]: minionsApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(minionsApi.middleware, reviewsApi.middleware)
});
