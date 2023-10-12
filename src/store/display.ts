import { create } from 'zustand';

type DisplayType = 'pomodoro' | 'todo' | 'calendar';

export type State = {
  displayType: DisplayType;
};

export type Actions = {
  setDisplayType: (type: DisplayType) => void;
};

const useDisplayStore = create<State & Actions>(set => ({
  displayType: 'pomodoro',
  setDisplayType: (type: DisplayType) => set(() => ({ displayType: type })),
}));

export default useDisplayStore;
