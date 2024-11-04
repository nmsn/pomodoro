import { clsx } from 'clsx';

import useCalendar from './useCalendar';
export default function Calendar() {
  const { curBlocks, onMonthSwitch, WEEK_DAYS, year, month } = useCalendar();

  return (
    <div className="flex justify-center items-center p-4 w-[280px] rounded-xl border border-black/[0.1] bg-gray-50">
      <div>
        <div className="flex justify-between items-center mb-2 rounded-lg text-xl text-black">
          <div onClick={() => onMonthSwitch(-1)} className="cursor-pointer">
            {'<'}
          </div>
          <div>{`${year}-${month}`}</div>
          <div className="cursor-pointer" onClick={() => onMonthSwitch(1)}>
            {'>'}
          </div>
        </div>
        <div className="grid grid-rows-6 grid-cols-7 gap-2">
          {WEEK_DAYS.map(item => (
            <div key={item}>
              <div className="w-full h-full flex justify-center items-center opacity-50">
                {item}
              </div>
            </div>
          ))}
          {curBlocks.map(item => (
            <div key={item.date}>
              <div
                className={clsx(
                  'text-sm w-[32px] h-[32px] flex justify-center items-center rounded-full',
                  item.isCurMonth ? '' : 'opacity-50',
                  item.isCurDate ? 'border-2 border-black border-solid' : '',
                )}
              >
                {item.day}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
