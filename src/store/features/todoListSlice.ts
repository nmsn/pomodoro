import { TodoItemDataType } from '@/components/Todo';
import { createSlice } from '@reduxjs/toolkit';

export type TodoListStateType = {
  todoList: TodoItemDataType[];
};

const initialState: TodoListStateType = {
  todoList: [],
};

export const todoListSlice = createSlice({
  name: 'todoList',
  initialState,
  reducers: {
    setTodoList(state, { payload }) {
      state.todoList = payload;
    },
  },
});

export const { setTodoList } = todoListSlice.actions;

export default todoListSlice.reducer;
