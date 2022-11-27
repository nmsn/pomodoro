import { useRef, useState, useMemo } from "react";
import Header from "./Header";
import Button from "./Button";
import classnames from "classnames";
import { atom, useRecoilState } from "recoil";

export const openState = atom({
  key: "openState",
  default: false,
});

const workMins = 25;
// const restMins = 5;
const second = 60;

const baseTime = workMins * second;
// const restTime = restMins * second;

const timeFormat = (val: number) => {
  const h = Math.floor((val / 3600) % 24);
  const m = Math.floor((val / 60) % 60);
  const s = Math.floor(val % 60);

  return [h, m, s];
};

type StatusType = "initial" | "processing" | "paused";

const Clock = () => {
  const timer = useRef<number | null>(null);
  const [time, setTime] = useState(baseTime);
  const [status, setStatus] = useState<StatusType>("initial");

  const [open, setOpen] = useRecoilState(openState);

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

          // TODO loop
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
    <div
      className={classnames(
        open ? "w-1/2" : "w-full",
        "h-full flex justify-center items-center duration-300 bg-blue-400 relative"
      )}
    >
      <Header open={open} onChange={setOpen} />
      <div className="w-120 flex-col block">
        <div className="text-9xl mb-12 font-bold select-none">
          {timeDisplay}
        </div>
        <div className="flex justify-center space-x-16">
          {status === "initial" && <Button onClick={onStart}>START</Button>}
          {status === "processing" && (
            <>
              <Button onClick={onPause}>PAUSE</Button>
              <Button onClick={onReset}>RESET</Button>
            </>
          )}
          {status === "paused" && (
            <>
              <Button onClick={onStart}>CONTINUE</Button>
              <Button onClick={onReset}>RESET</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clock;
