import { configureStore } from "@reduxjs/toolkit";

import todoListSlice from "./features/todoListSlice";

const store = configureStore({
  reducer: {
    todoList: todoListSlice,
  },
});

export default store;

export type UseDispatchType = typeof store.dispatch;

export type RootSateType = ReturnType<typeof store.getState>;
