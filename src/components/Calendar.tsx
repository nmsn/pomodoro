import { useMemo, useState } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';

const W_SUM = 7;
const H_SUM = 5;
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const Num = ({ children, type = 'fail' }: { children: number; type?: 'success' | 'fail' }) => {
  return (
    <div
      className={classnames(
        'w-5 h-5 rounded-full  mb-2 mr-2 flex justify-center items-center font-bold text-sm text-white',
        type === 'success' ? 'bg-green-500' : 'bg-red-500',
      )}
    >
      {children}
    </div>
  );
};

const BlockItem = ({
  children,
  itemClassName,
}: {
  children: React.ReactNode;
  itemClassName?: string;
}) => {
  return (
    <div className={classnames('w-40 h-24 relative  bg-black p-2', itemClassName)}>{children}</div>
  );
};

const curYear = dayjs().year();
const curMonth = dayjs().month() + 1;

const Calendar = () => {
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
    const isCurMonth = curDays[index].includes(`${year}-${month}`);
    return {
      date: curDays[index],
      success: 1,
      fail: 2,
      isCurMonth,
    };
  });

  return (
    <div className={classnames('h-full w-full flex justify-center items-center bg-red-400')}>
      <div>
        <div className="w-full h-20 bg-black flex justify-center items-center gap-2 mb-2">
          <div
            onClick={() => onMonthSwitch(-1)}
            className="font-bold text-sm text-red-400 cursor-pointer"
          >
            {'<'}
          </div>
          <div className="font-bold text-sm text-red-400">{`${year}-${month}`}</div>
          <div
            className="font-bold text-sm text-red-400 cursor-pointer"
            onClick={() => onMonthSwitch(1)}
          >
            {'>'}
          </div>
        </div>
        <div className="grid grid-rows-6 grid-cols-7 gap-1">
          {WEEK_DAYS.map(item => (
            <BlockItem key={item}>
              <div className="w-full h-full flex justify-center items-center">
                <div className="font-bold text-sm text-red-400">{item}</div>
              </div>
            </BlockItem>
          ))}
          {curBlocks.map(item => (
            <BlockItem key={item.date}>
              <div>
                <div
                  className={classnames(
                    'font-bold text-sm text-red-400',
                    item.isCurMonth ? '' : 'opacity-70',
                  )}
                >
                  {item.date}
                </div>
                <div className="flex justify-center items-center absolute right-1 bottom-1">
                  <Num type="success">{item.success}</Num>
                  <Num>{item.fail}</Num>
                </div>
              </div>
            </BlockItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;