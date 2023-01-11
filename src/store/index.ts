import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import todoListSlice from "./features/todoListSlice";

const store = configureStore({
  reducer: {
    todoList: todoListSlice,
  },
});

export default store;

export type UseDispatchType = typeof store.dispatch;

export type RootSateType = ReturnType<typeof store.getState>;

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
