import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";

import {
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

const actualStorage = storage.default || storage;

// Version 2: ensures savedJobs and searchedQuery exist after rehydration
const migrations = {
  2: (state) => {
    return {
      ...state,
      job: {
        ...state?.job,
        savedJobs: state?.job?.savedJobs ?? [],
        searchedQuery: state?.job?.searchedQuery ?? "",
      },
    };
  },
};

const persistConfig = {
  key: "root",
  version: 3,
  storage: actualStorage,
  whitelist: ["auth"], // Only persist logged-in auth state to avoid cross-user session pollution
};

const rootReducer = combineReducers({
  auth: authSlice,
  job: jobSlice,
  company: companySlice,
  application: applicationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export default store;