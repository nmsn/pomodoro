import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import todoListSlice from "./features/todoListSlice";
import { persistStore } from "redux-persist";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = {
  todoList: todoListSlice,
};

const persistedReducers = combineReducers({
  todoList: persistReducer(persistConfig, todoListSlice),
});

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// export default store;

export type UseDispatchType = typeof store.dispatch;

export type RootSateType = ReturnType<typeof store.getState>;

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
