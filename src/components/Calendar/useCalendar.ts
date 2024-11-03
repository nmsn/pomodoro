import { useMemo, useState } from 'react';
// TODO 更轻量日期库
import dayjs from 'dayjs';

const W_SUM = 7;
const H_SUM = 5;
const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const BLOCKS = new Array(H_SUM)
  .fill('')
  .map(() => new Array(W_SUM).fill(''))
  .flat(1)
  .fill('');

export const getDaysOfMonth = (
  year: number = dayjs().year(),
  month: number = dayjs().month() + 1,
) => {
  let firstDayOfMonth = dayjs(`${year}-${month}-1`);
  let lastDayOfMonth = dayjs(`${year}-${month + 1}-1`).subtract(1, 'day');
  // 开始补全第一天前的日期
  while (firstDayOfMonth.day() !== 0) {
    firstDayOfMonth = firstDayOfMonth.subtract(1, 'day');
  }

  // 开始补全最后一天后的日期
  while (lastDayOfMonth.day() !== 6) {
    lastDayOfMonth = lastDayOfMonth.add(1, 'day');
  }

  const days = [];
  let tempDate = firstDayOfMonth;
  while (tempDate.isBefore(lastDayOfMonth) || tempDate.isSame(lastDayOfMonth)) {
    days.push(tempDate);
    tempDate = tempDate.add(1, 'day');
  }

  return days.map(item => item.format('YYYY-MM-DD'));
};

const curYear = dayjs().year();
const curMonth = dayjs().month() + 1;
const curDate = dayjs().date();

export default function useCalendar() {
  const [time, setTime] = useState<[number, number]>([curYear, curMonth]);

  const [year, month] = time;

  const onMonthSwitch = (action: number) => {
    const day = dayjs(`${year}-${month}`);
    const newDay = day.add(action, 'month');
    const result = newDay.format('YYYY-MM').split('-').map(Number) as [number, number];
    setTime(result);
  };

  const curDays = useMemo(() => {
    return getDaysOfMonth(year, month);
  }, [month, year]);

  const curBlocks = BLOCKS.map((_, index) => {
    const isCurMonth = curDays[index].includes(`${curYear}-${curMonth}`);
    const isCurDate = curDays[index].includes(`${curYear}-${curMonth}-${curDate}`);
    const date = curDays[index];
    const [year, month, day] = date.split('-').map(Number);
    return {
      date,
      year,
      month,
      day,
      isCurMonth,
      isCurDate,
    };
  });

  return {
    curBlocks,
    onMonthSwitch,
    WEEK_DAYS,
    year,
    month,
  };
}
