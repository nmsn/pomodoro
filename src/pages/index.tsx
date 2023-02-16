import type { NextPage } from 'next';

import Clock from '@/components/Clock';
import Footer from '@/components/Footer';
import Todo from '@/components/Todo';

const Home: NextPage = () => {
  return (
    <div className="w-screen h-screen bg-blue-400 flex">
      <Todo />
      <Clock />
      <Footer />
    </div>
  );
};

export default Home;
