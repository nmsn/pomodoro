import { configureStore } from "@reduxjs/toolkit";

import todoListSlice from "./features/todoListSlice";

export default configureStore({
  reducer: {
    todoList: todoListSlice,
  },
});
