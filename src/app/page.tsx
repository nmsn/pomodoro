'use client';

import { useEffect } from 'react';
import type { NextPage } from 'next';
import classnames from 'classnames';

import Calendar from '@/components/Calendar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Pomodoro from '@/components/Pomodoro';
import Todo from '@/components/Todo';
import useDisplayStore from '@/store/display';
import useTodoStore from '@/store/todo';

const Home: NextPage = () => {
  const displayType = useDisplayStore(state => state.displayType);

  useEffect(() => {
    useTodoStore.persist.rehydrate();
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Header />
      <div className={classnames('w-full h-full flex flex-row')}>
        <Calendar open={displayType === 'calendar'} />
        <Todo open={displayType === 'todo'} />
        <Pomodoro open={displayType === 'pomodoro'} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
