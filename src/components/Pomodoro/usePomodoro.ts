import { useMemo, useRef, useState } from 'react';

import { fireworks } from '@/utils/confetti';

type StatusType = 'initial' | 'processing' | 'paused';

const workMins = 25;

const second = 60;

const baseTime = workMins * second;
// const restTime = restMins * second;

const timeFormat = (val: number) => {
  const m = Math.floor((val / 60) % 60);
  const s = Math.floor(val % 60);

  return [m, s];
};

export default function usePomodoro() {
  const timer = useRef<number | null>(null);
  const [time, setTime] = useState(baseTime);
  const [status, setStatus] = useState<StatusType>('initial');

  const [timeType, setTimeType] = useState<'normal' | 'double'>('normal');

  const timeDisplay = useMemo(() => {
    return timeFormat(time)?.map(item => item.toString().padStart(2, '0'));
  }, [time]);

  const ratio = useMemo(() => {
    const _ratio = time / (timeType === 'double' ? baseTime * 2 : baseTime);
    return +_ratio.toFixed(2);
  }, [time, timeType]);

  const onStart = () => {
    setStatus('processing');
    timer.current = window.setInterval(() => {
      setTime(pre => {
        if (pre === 0) {
          // timer is finish
          fireworks();
          onReset();
        }
        return pre - 1;
      });
    }, 1000);
  };

  const onPause = () => {
    if (timer.current) {
      setStatus('paused');
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  const onReset = (type: 'normal' | 'double' = 'normal') => {
    setTime(type === 'double' ? baseTime * 2 : baseTime);
    setStatus('initial');

    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  const onChangeTimeType = (type: 'normal' | 'double') => {
    setTimeType(type);
    // TODO is timing, prompt user whether reset
    onReset(type);
  };

  return {
    onStart,
    onReset,
    onPause,
    onChangeTimeType,
    timeDisplay,
    status,
    timeType,
    ratio,
  };
}
