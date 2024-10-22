import { clsx } from 'clsx';

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

import usePomodoro from './usePomodoro';

// TODO 反向类型
function CircleButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="min-w-2 rounded-full bg-black text-white px-2">
      {children}
    </button>
  );
}

export default function BasePomodoro() {
  const {
    onStart,
    onPause,
    onReset,
    onChangeTimeType,
    timeDisplay,
    status,
    ratio /* , timeType */,
  } = usePomodoro();

  return (
    <CardContainer className="inter-var border-black/[0.1]">
      <CardBody className="bg-gray-50  flex flex-col justify-between items-center p-10 w-[300px] h-[300px] rounded-xl border border-black/[0.1]">
        <div className="flex justify-end gap-4 w-full">
          <CardItem translateZ={20}>
            <CircleButton onClick={() => onChangeTimeType('normal')}>1</CircleButton>
          </CardItem>
          <CardItem translateZ={20}>
            <CircleButton onClick={() => onChangeTimeType('double')}>2</CircleButton>
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
        {/* TODO 按钮会抖动 */}
        <CardItem
          translateZ={50}
          class={clsx(
            'flex justify-center w-full',
            status === 'initial' ? 'justify-center' : 'justify-between',
          )}
        >
          {status === 'initial' && <CircleButton onClick={onStart}>START</CircleButton>}
          {status === 'processing' && (
            <>
              <CircleButton onClick={onPause}>PAUSE</CircleButton>
              <CircleButton onClick={onReset}>RESET</CircleButton>
            </>
          )}
          {status === 'paused' && (
            <>
              <CircleButton onClick={onStart}>CONTINUE</CircleButton>
              <CircleButton onClick={onReset}>RESET</CircleButton>
            </>
          )}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
