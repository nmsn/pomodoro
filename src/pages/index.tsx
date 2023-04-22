import type { NextPage } from 'next';
import classnames from 'classnames';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Pomodoro from '@/components/Pomodoro';
import Todo from '@/components/Todo';
import { openTodoList } from '@/store/features/todoListSlice';
import { isMobile } from '@/utils';

import { useAppDispatch, useAppSelector } from '../store';

const Home: NextPage = () => {
  const { visible } = useAppSelector(state => state.todoList);
  const _isMobile = isMobile();

  const { clockWidth, clockHeight, todoHeight, todoWidth } = (() => {
    if (_isMobile) {
      return visible
        ? { clockWidth: 'w-full', clockHeight: 'h-0', todoWidth: 'w-full', todoHeight: 'h-full' }
        : { clockWidth: 'w-full', clockHeight: 'h-full', todoWidth: 'w-full', todoHeight: 'h-0' };
    }

    return visible
      ? { clockWidth: 'w-1/2', clockHeight: 'h-full', todoWidth: 'w-1/2', todoHeight: 'h-full' }
      : { clockWidth: 'w-full', clockHeight: 'h-full', todoWidth: 'w-0', todoHeight: 'h-full' };
  })();

  const dispatch = useAppDispatch();

  const onOpen = (visible: boolean) => {
    dispatch(openTodoList(visible));
  };

  return (
    <div className="absolute inset-0">
      <Header open={visible} onChange={onOpen} />
      <div className={classnames('w-full h-full flex', _isMobile ? 'flex-col' : 'flex-row')}>
        <Todo width={todoWidth} height={todoHeight} />
        <Pomodoro width={clockWidth} height={clockHeight} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
