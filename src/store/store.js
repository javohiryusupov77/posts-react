import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './PostSlice';

const store = configureStore({
  reducer: {
    postsReducer,
  },
});

export default store;
