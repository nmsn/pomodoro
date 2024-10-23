import { clsx } from 'clsx';

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

import usePomodoro from './usePomodoro';

// TODO 反向类型
function CircleButton({
  children,
  onClick,
  type = 'normal',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'normal' | 'border';
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'min-w-2 rounded-full px-2 border-black border-2',
        type === 'normal' ? 'bg-black text-white' : '',
      )}
    >
      {children}
    </button>
  );
}

export default function BasePomodoro() {
  const { onStart, onPause, onReset, onChangeTimeType, timeDisplay, status, ratio, timeType } =
    usePomodoro();

  return (
    <CardContainer className="inter-var border-black/[0.1]">
      <CardBody className="bg-gray-50  flex flex-col justify-between items-center p-10 w-[280px] h-[280px] rounded-xl border border-black/[0.1]">
        <div className="flex justify-end gap-4 w-full">
          <CardItem translateZ={20}>
            <CircleButton
              type={timeType === 'normal' ? 'normal' : 'border'}
              onClick={() => onChangeTimeType('normal')}
            >
              1
            </CircleButton>
          </CardItem>
          <CardItem translateZ={20}>
            <CircleButton
              type={timeType === 'double' ? 'normal' : 'border'}
              onClick={() => onChangeTimeType('double')}
            >
              2
            </CircleButton>
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
        <CardItem translateZ={50} class="flex justify-center w-full">
          {status === 'initial' && <CircleButton onClick={onStart}>START</CircleButton>}
          {status === 'processing' && (
            <div className="flex gap-16">
              <CircleButton onClick={onPause}>PAUSE</CircleButton>
              <CircleButton onClick={onReset}>RESET</CircleButton>
            </div>
          )}
          {status === 'paused' && (
            <div className=" flex gap-16">
              <CircleButton onClick={onStart}>CONTINUE</CircleButton>
              <CircleButton onClick={onReset}>RESET</CircleButton>
            </div>
          )}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
