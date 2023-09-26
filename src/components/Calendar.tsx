import classnames from 'classnames';
import dayjs from 'dayjs';

const W_SUM = 7;
const H_SUM = 6;

export const getDaysOfMonth = (year: number, month: number) => {
  const firstDayOfMonth = dayjs(`${year}-${month}-1`);
  const lastDayOfMonth = dayjs(`${year}-${month + 1}-1`).subtract(1, 'day');
  const days = [];

  let tempDate = firstDayOfMonth;
  while (tempDate.isBefore(lastDayOfMonth) || tempDate.isSame(lastDayOfMonth)) {
    days.push(tempDate);
    tempDate = tempDate.add(1, 'day');
  }

  return days;
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const block = new Array(H_SUM).fill('').map(_ => new Array(W_SUM).fill(''));

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
    <div
      className={classnames(
        'w-40 h-24 relative border-teal-200 border-2 bg-red-200',
        itemClassName,
      )}
    >
      {children}
    </div>
  );
};

const Calendar = () => {
  return (
    <div className={classnames('h-full w-full flex justify-center items-center')}>
      <div>
        {block.map((item, index) => (
          <div key={item.toString()} className="flex">
            {index === 0
              ? item.map((item2, index2) => (
                  <BlockItem key={item2}>
                    <div className="w-full h-full flex justify-center items-center">
                      <div>{weekDays[index2]}</div>
                    </div>
                  </BlockItem>
                ))
              : item.map((item2, index2) => (
                  <BlockItem key={item2}>
                    <Num>{index2}</Num>
                  </BlockItem>
                ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
