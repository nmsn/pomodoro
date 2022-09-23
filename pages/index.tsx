import type { NextPage } from "next";
import { useRef, useState, useMemo } from "react";
// import Head from "next/head";

const minutes = 25;
const second = 60;

const baseTime = minutes * second;

const timeFormat = (val: number) => {
  const h = Math.floor((val / 3600) % 24);
  const m = Math.floor((val / 60) % 60);
  const s = Math.floor(val % 60);

  return [h, m, s];
};

const CurButton = ({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) => {
  return (
    <button
      className="w-32 px-2 py-1 rounded border-2 border-current"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

type StatusType = "initial" | "processing" | "paused";

const Home: NextPage = () => {
  const timer = useRef<number | null>(null);
  const [time, setTime] = useState(baseTime);
  const [status, setStatus] = useState("initial");

  const timeDisplay = useMemo(() => {
    const [h, m, s] = timeFormat(time)?.map((item) =>
      item.toString().padStart(2, "0")
    );

    return `${h}:${m}:${s}`;
  }, [time]);

  const onStart = () => {
    setStatus("processing");
    timer.current = window.setInterval(() => {
      setTime((pre) => {
        if (pre === 0) {
          timer.current && window.clearInterval(timer.current);
          setTime(baseTime);
        }
        return pre - 1;
      });
    }, 1000);
  };

  const onPause = () => {
    if (timer.current) {
      setStatus("paused");
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  const onReset = () => {
    setStatus("initial");
    setTime(baseTime);

    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  return (
    <div className="w-screen h-screen bg-red-500 flex justify-center items-center">
      <div className="w-120 flex-col block">
        <div className="text-9xl mb-12">{timeDisplay}</div>
        <div className="flex justify-center space-x-16">
          {status === "initial" && (
            <CurButton onClick={onStart}>Start</CurButton>
          )}
          {status === "processing" && (
            <CurButton onClick={onPause}>Pause</CurButton>
          )}

          {status === "paused" && (
            <CurButton onClick={onStart}>Continue</CurButton>
          )}

          <CurButton onClick={onReset}>Reset</CurButton>
        </div>
      </div>
    </div>
  );
};

export default Home;
