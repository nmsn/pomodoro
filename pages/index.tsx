import type { NextPage } from "next";
import Todo from "../components/Todo";
import Footer from "../components/Footer";
import Clock from "../components/Clock";

import { Provider } from "react-redux";
import store from "../store";

const Home: NextPage = () => {
  return (
    <Provider store={store}>
      <div className="w-screen h-screen bg-blue-400 flex">
        <Todo />
        <Clock />
        <Footer />
      </div>
    </Provider>
  );
};

export default Home;
