import type { NextPage } from "next";
import { useRef, useState, useMemo } from "react";

const workMins = 25;
const second = 60;

const baseTime = workMins * second;

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
      className="w-32 px-2 py-2 rounded-lg font-bold bg-black text-blue-400 hover:text-blue-300 shadow-md"
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
  const [status, setStatus] = useState<StatusType>("initial");

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
          onReset();
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
    setTime(baseTime);
    setStatus("initial");

    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  return (
    <div className="w-screen h-screen bg-blue-400 flex justify-center items-center">
      <div className="w-120 flex-col block">
        <div className="text-9xl mb-12 font-bold">{timeDisplay}</div>
        <div className="flex justify-center space-x-16">
          {status === "initial" && (
            <CurButton onClick={onStart}>START</CurButton>
          )}
          {status === "processing" && (
            <>
              <CurButton onClick={onPause}>PAUSE</CurButton>
              <CurButton onClick={onReset}>RESET</CurButton>
            </>
          )}

          {status === "paused" && (
            <>
              <CurButton onClick={onStart}>CONTINUE</CurButton>
              <CurButton onClick={onReset}>RESET</CurButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
