import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';

import { useAppDispatch, useAppSelector } from '@/store';
import { openTodoList, setTodoList } from '@/store/features/todoListSlice';

import { shine } from '../utils/confetti';

import Button from './Button';
import { Check, LoopIcon, XMark } from './Icon';

export const ItemTypes = {
  TODO_ITEM: 'todoItem',
};

export type TodoItemDataType = {
  value: string;
  checked: boolean;
  date: number;
  id: string; // use value + Date.now() as unique key
};

type TodoItemProps = TodoItemDataType & {
  sortMark: number;
  find: (id: TodoItemDataType['id']) => DragItemType | undefined;
  move: (id: TodoItemDataType['id'], toIndex: number) => void;
};

type DragItemType = { item: TodoItemDataType } & { index: number };

const checkExpired = (date: number) => {
  const today = new Date().setHours(0, 0, 0, 0);

  return date < today;
};

const TodoItem = ({ id, value, date, checked, sortMark, find }: TodoItemProps) => {
  const { todoList } = useAppSelector(state => state.todoList);
  const dispatch = useAppDispatch();

  const originalIndex = find(id)?.index ?? 0;

  const onDelete = (id: string) => {
    dispatch(setTodoList(todoList.filter(item => item.id !== id)));
  };

  const onChangeStats = (id: string) => {
    // TODO if all checked, show firework
    const result = [...todoList];
    const index = result.findIndex(item => item.id === id);

    const newStatus = !result[index].checked;

    if (newStatus) {
      shine();
    }

    result[index] = {
      ...result[index],
      checked: newStatus,
    };

    dispatch(setTodoList(result));
  };

  const isExpired = checkExpired(date);

  return (
    <Draggable draggableId={id} index={originalIndex} key={id}>
      {provided => (
        <div
          className="w-full flex justify-between rounded-lg bg-black text-red-400 p-2 font-bold transform mb-4"
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="flex justify-start flex-auto truncate">
            <div className="font-bold pr-2">{sortMark + 1}.</div>
            <div
              className={classnames('font-bold  truncate', checked ? 'line-through' : undefined)}
            >
              {value}
            </div>
          </div>
          {/* TODO change animation */}
          <div className="pl-4 flex justify-end flex-none">
            {isExpired && <div className="pr-2">E</div>}
            {checked ? (
              <LoopIcon onClick={() => onChangeStats(id)} />
            ) : (
              <Check onClick={() => onChangeStats(id)} />
            )}
            <XMark onClick={() => onDelete(id)} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

const TodoList = () => {
  const { todoList } = useAppSelector(state => state.todoList);
  const dispatch = useAppDispatch();

  const find = useCallback(
    (id: TodoItemDataType['id']) => {
      const curItem = todoList.find(c => `${c?.id}` === id);

      if (curItem) {
        return {
          item: curItem,
          index: todoList.indexOf(curItem),
        };
      }

      return undefined;
    },
    [todoList],
  );

  const move = useCallback(
    (id: TodoItemDataType['id'], toIndex: number) => {
      const findItem = find(id);

      if (findItem) {
        const { item: curItem, index } = findItem;
        const newTodoList = [...todoList];
        newTodoList.splice(index, 1);
        newTodoList.splice(toIndex, 0, curItem);

        dispatch(setTodoList(newTodoList));
      }
    },
    [dispatch, find, todoList],
  );

  // 初始化时清除过期且完成的 todo
  useLayoutEffect(() => {
    const validTodoList = todoList.filter(item => {
      const { checked, date } = item;
      const isExpired = checkExpired(date);
      return !(isExpired && checked);
    });

    dispatch(setTodoList(validTodoList));
    dispatch(openTodoList(!!todoList.length));
  }, []);

  const onDragEnd: OnDragEndResponder = result => {
    const { source, destination } = result || {};

    const { index: sourceIndex } = source || {};
    const { index: toIndex = 0 } = destination || {};

    const newTodoList = [...todoList];
    const sourceItem = newTodoList.find((item, index) => index === sourceIndex);

    if (sourceItem) {
      newTodoList.splice(sourceIndex, 1);
      newTodoList.splice(toIndex, 0, sourceItem);

      dispatch(setTodoList(newTodoList));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="LIST">
        {provided => (
          <div
            className="w-10/12 flex flex-col"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {todoList?.map((item, index) => (
              <TodoItem {...item} key={item.id} sortMark={index} find={find} move={move} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const AddLine = () => {
  const [value, onChange] = useState('');

  const { todoList } = useAppSelector(state => state.todoList);
  const dispatch = useAppDispatch();

  const onAdd = useCallback(() => {
    if (!value) {
      return;
    }

    const date = Date.now();
    const item = {
      checked: false,
      value,
      date,
      id: value + '+' + date,
    };

    dispatch(setTodoList([...todoList, item]));
    onChange('');
  }, [dispatch, todoList, value]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        onAdd();
      }
    });
  }, [onAdd]);

  return (
    <div className="flex space-x-4 w-10/12">
      <input
        className="rounded-lg shadow-md flex-1 px-4 py-2 font-bold focus:outline-red-400"
        value={value}
        onChange={e => onChange(e.target.value)}
        ref={inputRef}
      />
      <Button className="text-red-400" onClick={onAdd}>
        ADD
      </Button>
    </div>
  );
};

const Todo = ({ width = 'w-0', height = 'h-0' }: { width: string; height: string }) => {
  return (
    <div
      className={classnames(
        width,
        height,
        'flex flex-col justify-center items-center duration-300 bg-red-400 space-y-4 overflow-hidden',
      )}
    >
      <AddLine />
      <TodoList />
    </div>
  );
};

export default Todo;
