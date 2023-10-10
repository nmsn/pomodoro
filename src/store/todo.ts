import dayjs from 'dayjs';
import { create } from 'zustand';

export type TodoItemType = {
  status: 'success' | 'failed' | 'processing';
  content: string;
  createdTime: string;
  id: string;
};

type DayItemType = {
  todoList: TodoItemType[];
  // 数据对应的日期
  date: string;
};

export type State = {
  calendar: DayItemType[];
  // 当前展示的日期
  date: string;
};

export type Actions = {
  add: (date: string, content?: string) => void;
  update: (date: string, id: string, status: TodoItemType['status']) => void;
  delete: (date: string, id: string) => void;
  setDate: (date: string) => void;
  move: (date: string, sourceIndex: number, toIndex: number) => void;
};
// TODO 使用 immer 优化
const useTodoStore = create<State & Actions>(set => ({
  calendar: [] as DayItemType[],
  date: dayjs().format('YYYY-MM-DD'),
  setDate: (date: string) => set(() => ({ date })),
  move: (date: string, sourceIndex: number, toIndex: number) =>
    set(state => {
      const { calendar } = state;
      const newCalendar = [...calendar];
      const todayIndex = newCalendar.findIndex(item => item.date === date);
      const { todoList } = newCalendar[todayIndex];
      const newTodoList = [...todoList];
      const sourceItem = newTodoList.find((item, index) => index === sourceIndex) as TodoItemType;

      newTodoList.splice(sourceIndex, 1);
      newTodoList.splice(toIndex, 0, sourceItem);
      return { calendar: newCalendar };
    }),
  // 没有 content 的情况为增加当天空数据列表
  add: (date: string, content?: string) =>
    set(state => {
      const day = dayjs();
      const time = day.format('HH:mm:ss');
      const { calendar } = state;
      const newCalendar = [...calendar];
      const todayIndex = newCalendar.findIndex(item => item.date === date);
      console.log(date, todayIndex, newCalendar, content);
      if (todayIndex < 0) {
        newCalendar.push({
          date,
          todoList: [],
        });
      }
      const { todoList } = newCalendar[newCalendar?.length - 1];

      if (content) {
        todoList.push({
          status: 'processing',
          content,
          createdTime: time,
          id: content + time,
        });
      }

      return { calendar: newCalendar };
    }),
  update: (date: string, id: string, status: TodoItemType['status']) =>
    set(state => {
      const { calendar } = state;
      const newCalendar = [...calendar];
      const todayIndex = newCalendar.findIndex(item => item.date === date);
      const { todoList } = newCalendar[todayIndex];
      const itemIndex = todoList.findIndex(item => item.id === id);
      todoList[itemIndex].status = status;
      return { calendar: newCalendar };
    }),
  delete: (date: string, id: string) =>
    set(state => {
      const { calendar } = state;
      const newCalendar = [...calendar];
      const todayIndex = newCalendar.findIndex(item => item.date === date);
      const { todoList } = newCalendar[todayIndex];
      newCalendar[todayIndex].todoList = todoList.filter(item => item.id !== id);
      return { calendar: newCalendar };
    }),
}));

export default useTodoStore;
