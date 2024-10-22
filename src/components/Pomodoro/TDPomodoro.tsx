import { clsx } from 'clsx';

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

import Button from '../Button';

import usePomodoro from './usePomodoro';

export default function BasePomodoro() {
  const { onStart, onPause, onReset, onChangeTimeType, timeDisplay, status, timeType, ratio } =
    usePomodoro();

  return (
    <CardContainer className="inter-var border-black/[0.1]">
      <CardBody className="bg-gray-50  flex flex-col justify-between items-center p-10 w-[300px] h-[300px] rounded-xl border border-black/[0.1]">
        <div className="flex justify-end gap-4 w-full">
          <CardItem translateZ={20}>
            <Button
              size="small"
              type={timeType === 'normal' ? 'inverse' : 'positive'}
              onClick={() => onChangeTimeType('normal')}
            >
              1
            </Button>
          </CardItem>
          <CardItem translateZ={20}>
            <Button
              size="small"
              type={timeType === 'double' ? 'inverse' : 'positive'}
              onClick={() => onChangeTimeType('double')}
            >
              2
            </Button>
          </CardItem>
        </div>
        <CardItem translateZ={50} className="text-7xl font-bold select-none text-center">
          <div style={{ fontVariantNumeric: 'tabular-nums' }} className="mb-4">
            {`${timeDisplay[0]}:${timeDisplay[1]}`}
          </div>
          <div className="w-full">
            <div className="h-[2px] bg-black" style={{ width: ratio * 100 + '%' }} />
          </div>
        </CardItem>
        <CardItem
          translateZ={50}
          class={clsx(
            'flex justify-center w-full',
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
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
