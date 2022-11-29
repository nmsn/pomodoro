import type { NextPage } from "next";
import { useRecoilValue } from "recoil";
import Todo from "../components/Todo";
import Clock, { openState } from "../components/Clock";

const Home: NextPage = () => {
  const open = useRecoilValue(openState);
  return (
    <div className="w-screen h-screen bg-blue-400 flex">
      <Todo open={open} />
      <Clock />
    </div>
  );
};

export default Home;

export type A = Awaited<{ then: (onfulfilled: (value: number) => number) => any }>;
