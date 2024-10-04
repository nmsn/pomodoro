import classnames from 'classnames';

import MiniPomodoro from './Pomodoro/MiniPomodoro';

const Pomodoro = ({ open = false }: { open?: boolean }) => {
  return (
    <div
      className={classnames(
        open ? 'w-full' : 'w-0',
        'h-full flex justify-center items-center duration-300 bg-blue-400 relative overflow-hidden',
      )}
    >
      {/* <BasePomodoro /> */}
      <MiniPomodoro />
    </div>
  );
};

export default Pomodoro;
