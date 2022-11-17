import type { NextPage } from "next";
import { useRef, useState, useMemo, useEffect } from "react";
import {
  SwitchLoopIcon,
  BeakerIcon,
  ArrowRight,
  Check,
  XMark,
} from "../components/icon";
import classnames from "classnames";

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

const CurButton = ({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) => {
  return (
    <button
      className="w-32 px-2 py-2 rounded-lg font-bold bg-black text-blue-400 shadow-md select-none"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

type StatusType = "initial" | "processing" | "paused";

/**
 * TODO
 * Click arrow to open a TODO list
 */
const Header = ({
  open,
  onChange,
}: {
  open: boolean;
  onChange: (open: boolean) => void;
}) => {
  const [curOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(open);
  }, [open]);

  const onCurChange = (open: boolean) => {
    setOpen(open);
    onChange?.(open);
  };

  return (
    <div className="absolute top-0 w-full h-12 flex items-center px-4 space-x-4">
      <ArrowRight open={curOpen} onClick={() => onCurChange(!curOpen)} />
    </div>
  );
};

/**
 * TODO
 * Change color theme and loop button
 */
const Footer = ({
  onChangeSwitchLoopIcon,
}: {
  onChangeSwitchLoopIcon: (on: boolean) => void;
}) => {
  return (
    <div className="absolute bottom-0 w-screen h-12 flex justify-end items-center px-4 space-x-4">
      <BeakerIcon />
      <SwitchLoopIcon onChange={onChangeSwitchLoopIcon} />
    </div>
  );
};

type TODOItemProps = {
  value: string;
  checked: boolean;
  time: string;
  date: string;
};

const TODOItem = ({ value, checked, time }: TODOItemProps) => {
  return (
    <div className="flex">
      <div>{time}</div>
      <div>{value}</div>
      <div>{checked ? <Check /> : <XMark />}</div>
    </div>
  );
};

const testData = [
  { date: "2022-11-17", time: "123", value: "123", checked: true },
  { date: "2022-11-17", time: "123", value: "123", checked: true },
  { date: "2022-11-17", time: "123", value: "123", checked: true },
  { date: "2022-11-17", time: "123", value: "123", checked: true },
];

const TODOList = () => {
  const [list, setList] = useState<TODOItemProps[]>([]);
  return (
    <div className="w-120 flex flex-col">
      {testData.map((item, index) => (
        <TODOItem {...item} key={+index} />
      ))}
    </div>
  );
};

const TODO = ({ open }: { open: boolean }) => {
  return (
    <div
      className={classnames(
        open ? "w-1/2" : "w-0",
        "w-1/2 h-full flex justify-center items-center duration-300 bg-red-400"
      )}
    >
      <TODOList />
    </div>
  );
};

const Clock = ({
  open,
  onOpen,
}: {
  open: boolean;
  onOpen: (open: boolean) => void;
}) => {
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
      <Header open={open} onChange={onOpen} />
      <div className="w-120 flex-col block">
        <div className="text-9xl mb-12 font-bold select-none">
          {timeDisplay}
        </div>
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

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-screen h-screen bg-blue-400 flex">
      <TODO open={open} />
      <Clock open={open} onOpen={setOpen} />
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
