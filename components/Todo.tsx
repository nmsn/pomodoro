import { atom, useRecoilState, useRecoilValue } from "recoil";
import { Check, XMark } from "./Icon";
import Button from "./Button";
import classnames from "classnames";
import { useState } from "react";

type TodoItemProps = {
  index: number;
  value: string;
  checked: boolean;
  time: string;
  date: string;
};

const todoListState = atom({
  key: "todoListState",
  default: [] as TodoItemProps[],
});

const TodoItem = ({ value, checked, time, index }: TodoItemProps) => {
  const [_, setTodoList] = useRecoilState<TodoItemProps[]>(todoListState);

  const onDelete = (key: number) => {
    setTodoList((pre) =>
      pre
        .filter((item, index) => index !== key)
        .map((item, index) => ({ ...item, index }))
    );
  };

  return (
    <div className="w-full flex justify-between rounded-lg bg-black text-red-400 p-2 font-bold">
      <div className="font-bold pr-4">{index + 1}.</div>
      <div className="font-bold truncate">{value}</div>
      <div className="pl-4">
        {checked ? <Check /> : <XMark onClick={() => onDelete(index)} />}
      </div>
    </div>
  );
};

const TodoList = () => {
  const todoList = useRecoilValue<TodoItemProps[]>(todoListState);
  return (
    <div className="w-10/12 flex flex-col space-y-4">
      {todoList.map((item, index) => (
        <TodoItem {...item} key={+index} />
      ))}
    </div>
  );
};

const AddLine = () => {
  const [value, onChange] = useState("");

  const [todoList, setTodoList] =
    useRecoilState<TodoItemProps[]>(todoListState);

  const onAdd = () => {
    if (!value) {
      return;
    }
    const item = {
      checked: false,
      value,
      time: "123",
      date: "2022-11-17",
      index: todoList.length,
    };
    setTodoList((pre) => [...pre, item]);
    onChange("");
  };
  return (
    <div className="flex space-x-4 w-10/12">
      <input
        className="rounded-lg shadow-md flex-1 px-4 py-2 font-bold focus:outline-red-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button className="text-red-400" onClick={onAdd}>
        Add
      </Button>
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

export default Todo;
