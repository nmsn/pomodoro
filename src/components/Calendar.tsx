import classnames from 'classnames';
import dayjs from 'dayjs';

const W_SUM = 7;
const H_SUM = 5;

export const getDaysOfMonth = (year: number, month: number) => {
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

  return days;
};

const curYear = dayjs().year();
const curMonth = dayjs().month();

console.log(getDaysOfMonth(curYear, curMonth));

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const block = new Array(H_SUM)
  .fill('')
  .map(() => new Array(W_SUM).fill(''))
  .flat(1);

const Num = ({ children }: { children: number }) => {
  return (
    <div className="w-10 h-10 rounded-full bg-red-600 mb-2 mr-2 flex justify-center items-center absolute right-2 bottom-2">
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
    <div className={classnames('w-40 h-24 relative  bg-red-200', itemClassName)}>{children}</div>
  );
};

const Calendar = () => {
  return (
    <div className={classnames('h-full w-full flex justify-center items-center')}>
      <div className="grid grid-rows-6 grid-cols-7 gap-1">
        {weekDays.map(item => (
          <BlockItem key={item}>
            <div className="w-full h-full flex justify-center items-center">
              <div>{item}</div>
            </div>
          </BlockItem>
        ))}
        {block.map(item => (
          <BlockItem key={item}>
            <Num>{item}</Num>
          </BlockItem>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
