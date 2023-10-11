import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DisplayType = 'pomodoro' | 'todo' | 'calendar';

export type State = {
  displayType: DisplayType;
};

export type Actions = {
  setDisplayType: (type: DisplayType) => void;
};

const useDisplayStore = create<State & Actions, [['zustand/persist', unknown]]>(
  persist(
    set => ({
      displayType: 'pomodoro',
      setDisplayType: (type: DisplayType) => set(() => ({ displayType: type })),
    }),
    {
      name: 'display',
      skipHydration: true,
    },
  ),
);

export default useDisplayStore;
