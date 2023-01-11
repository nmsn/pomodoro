import type { NextPage } from "next";
import Todo from "@/components/Todo";
import Footer from "@/components/Footer";
import Clock from "@/components/Clock";

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
