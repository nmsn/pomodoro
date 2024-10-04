import classnames from 'classnames';

import { isPhone } from '@/utils';

import Button from '../Button';

import usePomodoro from './usePomodoro';

const BasePomodoro = () => {
  const { onStart, onPause, onReset, onChangeTimeType, timeDisplay, status, timeType } =
    usePomodoro();

  return (
    <div className="w-120 flex-col block">
      <div className="flex justify-end gap-2">
        <Button
          size="small"
          type={timeType === 'normal' ? 'inverse' : 'positive'}
          onClick={() => onChangeTimeType('normal')}
        >
          NORMAL
        </Button>
        <Button
          size="small"
          type={timeType === 'double' ? 'inverse' : 'positive'}
          onClick={() => onChangeTimeType('double')}
        >
          DOUBLE
        </Button>
      </div>
      <div
        className={classnames(
          isPhone() ? 'text-8xl' : 'text-9xl',
          `mt-6 mb-6 font-bold select-none text-center`,
        )}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {`${timeDisplay[0]}:${timeDisplay[1]}`}
      </div>
      <div
        className={classnames(
          'flex justify-center',
          status === 'initial' ? 'justify-center' : 'justify-between',
        )}
      >
        {status === 'initial' && <Button onClick={onStart}>START</Button>}
        {status === 'processing' && (
          <>
            <Button onClick={onPause}>PAUSE</Button>
            <Button onClick={onReset}>RESET</Button>
          </>
        )}
        {status === 'paused' && (
          <>
            <Button onClick={onStart}>CONTINUE</Button>
            <Button onClick={onReset}>RESET</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default BasePomodoro;
