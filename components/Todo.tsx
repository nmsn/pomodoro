import { atom, useRecoilState, useRecoilValue } from "recoil";
import { Check, XMark } from "./Icon";
import Button from "./Button";
import classnames from "classnames";
import { useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, useDrag, useDrop } from "react-dnd";

export const ItemTypes = {
  CARD: "card",
};

type TodoItemDataType = {
  value: string;
  checked: boolean;
  date: string; // use Date.now() as unique key
};

type TodoItemProps = TodoItemDataType & {
  index: number;
  find: (date: TodoItemDataType["date"]) => DragItemType;
  move: (date: TodoItemDataType["date"], toIndex: number) => void;
};

const todoListState = atom({
  key: "todoListState",
  default: [] as TodoItemDataType[],
});

type DragItemType = { item: TodoItemDataType } & { index: number };

const TodoItem = ({
  value,
  checked,
  date,
  index,
  find,
  move,
}: TodoItemProps) => {
  const [_, setTodoList] = useRecoilState<TodoItemDataType[]>(todoListState);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { date, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { date: curDate, index: curIndex } = item;
        const didDrop = monitor.didDrop();

        // 感觉是恢复原状了
        if (!didDrop) {
          move(curDate, curIndex);
        }
      },
    }),
    []
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      hover({ date: toDate }: TodoItemDataType) {
        if (toDate !== date) {
          const { index: curIndex } = find(date);
          move(toDate, curIndex);
        }
      },
    }),
    [find, move]
  );

  const onDelete = (key: number) => {
    setTodoList((pre) =>
      pre
        .filter((item, index) => index !== key)
        .map((item, index) => ({ ...item, index }))
    );
  };

  const opacity = isDragging ? 0 : 1;

  return (
    <div
      className="w-full flex justify-between rounded-lg bg-black text-red-400 p-2 font-bold"
      style={{ opacity }}
      ref={(node) => drag(drop(node))}
    >
      <div className="font-bold pr-4">{index + 1}.</div>
      <div className="font-bold truncate">{value}</div>
      <div className="pl-4">
        {checked ? <Check /> : <XMark onClick={() => onDelete(index)} />}
      </div>
    </div>
  );
};

const TodoList = () => {
  const [todoList, setTodoList] =
    useRecoilState<TodoItemDataType[]>(todoListState);

  const find = (date: TodoItemDataType["date"]) => {
    const curItem = todoList.find(
      (item) => date === item.date
    ) as TodoItemDataType;

    return {
      item: curItem,
      index: todoList.indexOf(curItem!),
    };
  };

  const move = (date: TodoItemDataType["date"], toIndex: number) => {
    const { item: curItem, index: curIndex } = find(date);

    const newList = [...todoList];
    newList.splice(curIndex, 1);
    newList.splice(toIndex, 0, curItem!);
    setTodoList(newList);
  };

  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));

  return (
    <div className="w-10/12 flex flex-col space-y-4" ref={drop}>
      {todoList.map((item, index) => (
        <TodoItem
          {...item}
          key={+index}
          index={index}
          find={find}
          move={move}
        />
      ))}
    </div>
  );
};

const AddLine = () => {
  const [value, onChange] = useState("");

  const [, setTodoList] = useRecoilState<TodoItemDataType[]>(todoListState);

  const onAdd = () => {
    if (!value) {
      return;
    }
    const item = {
      checked: false,
      value,
      date: Date.now().toString(),
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
      <DndProvider backend={HTML5Backend}>
        <TodoList />
      </DndProvider>
    </div>
  );
};

export default Todo;
