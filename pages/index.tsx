import type { NextPage } from "next";
import { useRef, useState, useMemo, useEffect } from "react";
import {
  SwitchLoopIcon,
  BeakerIcon,
  ArrowRight,
  Check,
  XMark,
} from "../components/Icon";
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
  className,
}: {
  children: string;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      className={classnames(
        "w-32 p-2 rounded-lg font-bold bg-black text-blue-400 shadow-md select-none",
        className
      )}
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

type TodoItemProps = {
  index: number;
  value: string;
  checked: boolean;
  time: string;
  date: string;
};

const TodoItem = ({ value, checked, time, index }: TodoItemProps) => {
  return (
    <div className="w-full flex justify-between rounded-lg bg-black text-red-400 p-2 font-bold">
      <div className="font-bold pr-4">{index}</div>
      <div className="font-bold truncate">{value}</div>
      <div className="pl-4">{checked ? <Check /> : <XMark />}</div>
    </div>
  );
};

const testData = [
  { date: "2022-11-17", time: "123", value: "测试文本", checked: true },
  {
    date: "2022-11-17",
    time: "123",
    value: "测试文本测试文本测试文本测试文本测试文本测试文本测试文本",
    checked: true,
  },
  { date: "2022-11-17", time: "123", value: "测试文本测试文本", checked: true },
  {
    date: "2022-11-17",
    time: "123",
    value:
      "测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本",
    checked: false,
  },
];

const TodoList = () => {
  const [list, setList] = useState<TodoItemProps[]>([]);
  return (
    <div className="w-10/12 flex flex-col space-y-4">
      {testData.map((item, index) => (
        <TodoItem {...item} key={+index} index={index + 1} />
      ))}
    </div>
  );
};

const AddLine = () => {
  const [value, onInput] = useState("");
  return (
    <div className="flex space-x-4 w-10/12">
      <input
        className="rounded-lg shadow-md flex-1 px-4 py-2 font-bold focus:outline-red-400"
        value={value}
        onChange={(e) => onInput(e.target.value)}
      />
      <CurButton className="text-red-400">Add</CurButton>
    </div>
  );
};

const Todo = ({ open }: { open: boolean }) => {
  return (
    <div
      className={classnames(
        open ? "w-1/2" : "w-0",
        "w-1/2 h-full flex flex-col justify-center items-center duration-300 bg-red-400 space-y-4"
      )}
    >
      <AddLine />
      <TodoList />
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
      <Todo open={open} />
      <Clock open={open} onOpen={setOpen} />
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
