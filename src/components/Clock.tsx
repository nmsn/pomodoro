import { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';

import { isPhone } from '@/utils';

const Clock = ({ width = 'w-0', height = 'h-0' }: { width: string; height: string }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  const timeStr = useMemo(() => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return [hours, minutes, seconds].map(item => item.toString().padStart(2, '0')).join(':');
  }, [date]);

  return (
    <div
      className={classnames(
        width,
        height,
        'flex justify-center items-center duration-300 bg-blue-400 relative overflow-hidden',
      )}
    >
      <div className="w-120 flex-col block">
        <div
          className={classnames(
            isPhone() ? 'text-8xl' : 'text-9xl',
            'text-9xl mt-6 mb-12 font-bold select-none',
          )}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {timeStr}
        </div>
      </div>
    </div>
  );
};

export default Clock;
