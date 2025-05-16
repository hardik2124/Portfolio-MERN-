import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import projectsReducer from './slices/projectSlice';

// Custom middleware for debugging
const loggerMiddleware = store => next => action => {
  if (process.env.NODE_ENV !== 'production') {
    console.group(`Redux Action: ${action.type}`);
    console.log('Previous state:', store.getState());
    console.log('Action:', action);
    const result = next(action);
    console.log('Next state:', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    projects: projectsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(loggerMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store; 