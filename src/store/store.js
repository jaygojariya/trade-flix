// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import storage from 'redux-persist/lib/storage';
import authSlice from './authSlice';

const encryptor = encryptTransform({
  secretKey: 'KzuhY31dxF1qzREOISTfP+1KpAx4xsnIxtBuuM4mbe0cyG/8W4HEbSXdtwa5JiLb', // Replace with a secure secret key
  onError: function(error) {
    // Handle the error
  },
});

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);