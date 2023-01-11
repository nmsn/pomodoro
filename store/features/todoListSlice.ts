import { createSlice } from "@reduxjs/toolkit";

export const todoListSlice = createSlice({
  name: "todoList",
  initialState: {
    visible: false,
    todoList: [],
  },
  reducers: {
    setTodoList(state, { payload }) {
      state.todoList = payload;
    },
    openTodoList(state, { payload }) {
      state.visible = payload;
    },
  },
});

export const { setTodoList, openTodoList } = todoListSlice.actions;

export default todoListSlice.reducer;
