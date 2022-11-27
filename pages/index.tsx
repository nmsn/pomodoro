import type { NextPage } from "next";
import { useState } from "react";
import Todo from "../components/Todo";
import Clock from "../components/Clock";

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-screen h-screen bg-blue-400 flex">
      <Todo open={open} />
      <Clock open={open} onOpen={setOpen} />
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
