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
  const m = Math.floor((val / 60) % 60);
  const s = Math.floor(val % 60);

  return [m, s];
};

type StatusType = "initial" | "processing" | "paused";

const Clock = () => {
  const timer = useRef<number | null>(null);
  const [time, setTime] = useState(baseTime);
  const [status, setStatus] = useState<StatusType>("initial");

  const [open, setOpen] = useRecoilState(openState);

  const [timeType, setTimeType] = useState<"normal" | "double">("normal");

  const timeDisplay = useMemo(() => {
    return timeFormat(time)?.map((item) => item.toString().padStart(2, "0"));
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

  const onReset = (type: "normal" | "double" = "normal") => {
    setTime(type === "double" ? baseTime * 2 : baseTime);
    setStatus("initial");

    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  const onChangeTimeType = (type: "normal" | "double") => {
    setTimeType(type);
    // TODO is timing, prompt user whether reset
    onReset(type);
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
        <div className="flex justify-end gap-2">
          <Button
            size="small"
            type={timeType === "normal" ? "inverse" : "positive"}
            onClick={() => onChangeTimeType("normal")}
          >
            NORMAL
          </Button>
          <Button
            size="small"
            type={timeType === "double" ? "inverse" : "positive"}
            onClick={() => onChangeTimeType("double")}
          >
            DOUBLE
          </Button>
        </div>
        <div className="text-9xl mb-12 font-bold select-none">
          {`${timeDisplay[0]}:${timeDisplay[1]}`}
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
