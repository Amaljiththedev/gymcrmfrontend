import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import memberReducer from '@/src/features/members/memberSlice';
import membershipPlanReducer from '@/src/features/membershipPlans/membershipPlanSlice';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import staffReducer from '@/src/features/staff/staffSlice';
import { persistReducer, persistStore } from 'redux-persist';

// Configuration for redux-persist; only persist the auth slice.
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Persist only auth state
};

// Combine all reducers: auth (persisted), members and membershipPlans (non-persisted).
const rootReducer = combineReducers({
  auth: authReducer, // Persisted
  members: memberReducer, // Not persisted
  membershipPlans: membershipPlanReducer, // Not persisted
  staff: staffReducer, 
});

// Wrap the rootReducer with persist capabilities.
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store.
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevent redux-persist warnings
    }),
});

// Create the persistor to sync persisted state.
export const persistor = persistStore(store);

// Export store types for use in components/hooks.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
