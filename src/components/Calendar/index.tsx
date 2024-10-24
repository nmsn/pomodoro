import { clsx } from 'clsx';

import useCalendar from './useCalendar';
export default function Calendar() {
  const { curBlocks, onMonthSwitch, WEEK_DAYS, year, month } = useCalendar();
  return (
    <div className="h-full flex justify-center items-center overflow-hidden duration-300">
      <div>
        <div className="w-full h-20 bg-black flex justify-center items-center gap-2 mb-2 rounded-lg text-xl font-bold text-white">
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
              <div className="w-full h-full flex justify-center items-center"></div>
            </div>
          ))}
          {curBlocks.map(item => (
            <div key={item.date}>
              <div>
                <div className={clsx('font-bold text-sm', item.isCurMonth ? '' : 'opacity-70')}>
                  {item.day}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
