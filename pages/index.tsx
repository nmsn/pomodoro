import type { NextPage } from "next";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import Todo from "../components/Todo";
import Footer from "../components/Footer";
import Clock, { openState } from "../components/Clock";
import { useSsrComplectedState } from "../utils/hooks";

const Home: NextPage = () => {
  const setSsrCompleted = useSsrComplectedState();
  useEffect(setSsrCompleted, [setSsrCompleted]);

  const open = useRecoilValue(openState);
  return (
    <div className="w-screen h-screen bg-blue-400 flex">
      <Todo open={open} />
      <Clock />
      <Footer />
    </div>
  );
};

export default Home;
