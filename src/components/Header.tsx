import Image from 'next/image';
import classnames from 'classnames';

import { setDisplayType } from '@/store/features/displaySlice';

import { useAppDispatch, useAppSelector } from '../store';

const Block = ({
  visible = false,
  type,
  onClick,
}: {
  visible?: boolean;
  type: 'pomodoro' | 'todo' | 'calendar';
  onClick?: () => void;
}) => {
  const color = {
    pomodoro: 'blue',
    todo: 'red',
    calendar: 'green',
  };

  return (
    <div
      className={classnames(
        'w-4 h-4 rounded-full border-2',
        `bg-${color[type]}-400`,
        visible ? 'border-white' : 'border-black',
      )}
      onClick={onClick}
    />
  );
};

const Navigation = () => {
  const { displayType } = useAppSelector(state => state.display);
  const dispatch = useAppDispatch();

  const onClick = (type: 'pomodoro' | 'todo' | 'calendar') => {
    dispatch(setDisplayType(type));
  };
  const map = ['calendar', 'todo', 'pomodoro'] as const;
  return (
    <div className="flex gap-2 justify-between">
      {map.map(item => (
        <Block
          key={item}
          onClick={() => onClick(item)}
          visible={displayType === item}
          type={item}
        />
      ))}
    </div>
  );
};

const Header = () => {
  return (
    <div className="absolute top-0 w-screen h-12 flex justify-between items-center px-4 space-x-4 z-10">
      <Navigation />
      <a className="cursor-pointer" href="https://github.com/nmsn/pomodoro">
        <Image src="/github.svg" alt="logo" width={24} height={24} />
      </a>
    </div>
  );
};

export default Header;
