import Image from 'next/image';
import classnames from 'classnames';
import dayjs from 'dayjs';

import useDisplayStore from '@/store/display';
import useTodoStore from '@/store/todo';
const NavItem = ({
  type,
  onClick,
  active = false,
}: {
  type: 'pomodoro' | 'todo' | 'calendar';
  onClick?: () => void;
  active?: boolean;
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
        active ? 'border-white cursor-default' : 'border-black cursor-pointer',
      )}
      onClick={onClick}
    />
  );
};

const Navigation = () => {
  const [displayType, setDisplayType] = useDisplayStore(state => [
    state.displayType,
    state.setDisplayType,
  ]);

  const setDate = useTodoStore(state => state.setDate);

  const onClick = (type: 'pomodoro' | 'todo' | 'calendar') => {
    setDisplayType(type);

    const today = dayjs().format('YYYY-MM-DD');
    setDate(today);
  };

  const map = ['calendar', 'todo', 'pomodoro'] as const;
  return (
    <div className={classnames('flex gap-2 justify-between')}>
      {map.map(item => (
        <NavItem
          key={item}
          onClick={item === displayType ? undefined : () => onClick(item)}
          active={displayType === item}
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
