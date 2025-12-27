// src/presentation/redux/store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "../slice/authSlice";
import projectReducer from "../slice/projectSlice";
import channelReducer from "../slice/channelSlice";
import uiReducer from "../slice/uiSlice";
import messageReducer from "../slice/messageSlice";
import userReducer from "../slice/userSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  ui: uiReducer,
  channel: channelReducer,
  messages: messageReducer,
  user: userReducer,
});

// Type root reducer BEFORE wrapping with persistReducer
export type RootReducerType = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "ui"],
};

// Now wrap
const persistedReducer = persistReducer<RootReducerType>(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
