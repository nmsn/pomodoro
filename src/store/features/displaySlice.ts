import { createSlice } from '@reduxjs/toolkit';

type DisplayType = 'pomodoro' | 'todo' | 'calendar';

export type DisplayStateType = {
  displayType: DisplayType;
};

const initialState: DisplayStateType = {
  displayType: 'pomodoro',
};

export const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    setDisplayType(state, { payload }: { payload: DisplayType }) {
      state.displayType = payload;
    },
  },
});

export const { setDisplayType } = displaySlice.actions;

export default displaySlice.reducer;
