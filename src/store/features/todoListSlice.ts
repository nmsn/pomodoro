import { TodoItemDataType } from '@/components/Todo';
import { createSlice } from '@reduxjs/toolkit';

export type TodoListStateType = {
  visible: boolean;
  todoList: TodoItemDataType[];
};

const initialState: TodoListStateType = {
  visible: false,
  todoList: [],
};

export const todoListSlice = createSlice({
  name: 'todoList',
  initialState,
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
