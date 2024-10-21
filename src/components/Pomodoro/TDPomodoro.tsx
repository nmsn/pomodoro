import { clsx } from 'clsx';

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

import Button from '../Button';

import usePomodoro from './usePomodoro';

export default function BasePomodoro() {
  const { onStart, onPause, onReset, onChangeTimeType, timeDisplay, status, timeType } =
    usePomodoro();

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50  flex flex-col items-center p-8 w-80 h-80 rounded">
        <div className="flex justify-end gap-2">
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
        <CardItem
          translateZ={50}
          className="text-7xl mt-12 mb-12 font-bold select-none text-center"
        >
          <div style={{ fontVariantNumeric: 'tabular-nums' }} className="mb-4">
            {`${timeDisplay[0]}:${timeDisplay[1]}`}
          </div>
          <div className="w-full h-1 bg-black" />
        </CardItem>
        <CardItem
          translateZ={50}
          class={clsx(
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
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
