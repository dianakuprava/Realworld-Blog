import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import articlesReducer from '@/store/slices/articlesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
  },
});
