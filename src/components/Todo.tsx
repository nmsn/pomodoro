import { useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';

import useTodoStore, { TodoItemType } from '@/store/todo';

import { shine } from '../utils/confetti';

import Button from './Button';
import { Check, LoopIcon, XMark } from './Icon';

export type TodoItemDataType = {
  value: string;
  checked: boolean;
  date: number;
  id: string; // use value + Date.now() as unique key
};

// FIXME 切换顺序有问题
const TodoItem = ({
  id,
  content,
  sortMark,
  find,
  status,
}: TodoItemType & {
  sortMark: number;
  find: (id: string) =>
    | {
        item: TodoItemType;
        index: number;
      }
    | undefined;
}) => {
  const updateItem = useTodoStore(state => state.update);
  const deleteItem = useTodoStore(state => state.delete);
  const date = useTodoStore(state => state.date);

  const originalIndex = find(id)?.index ?? 0;

  const onDelete = (id: string) => {
    deleteItem(date, id);
  };

  const onChangeStats = (id: string, status: 'success' | 'processing') => {
    if (status === 'success') {
      shine();
    }
    updateItem(date, id, status);
  };

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
              className={classnames(
                'font-bold  truncate',
                status === 'success' ? 'line-through' : undefined,
              )}
            >
              {content}
            </div>
          </div>
          {/* TODO change animation */}
          <div className="pl-4 flex justify-end flex-none">
            {status === 'success' ? (
              <LoopIcon onClick={() => onChangeStats(id, 'processing')} />
            ) : (
              <Check onClick={() => onChangeStats(id, 'success')} />
            )}
            <XMark onClick={() => onDelete(id)} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

const TodoList = () => {
  const calendar = useTodoStore(state => state.calendar);
  const date = useTodoStore(state => state.date);
  const move = useTodoStore(state => state.move);

  const { todoList } =
    calendar.find(item => item.date === date) || ({ todoList: [] } as { todoList: TodoItemType[] });

  const find = (id: TodoItemDataType['id']) => {
    const curItem = todoList.find(item => `${item?.id}` === id) as TodoItemType;

    if (curItem) {
      return {
        item: curItem,
        index: todoList.indexOf(curItem),
      };
    }

    return undefined;
  };

  const onDragEnd: OnDragEndResponder = result => {
    const { source, destination } = result || {};

    const { index: sourceIndex } = source || {};
    const { index: toIndex = 0 } = destination || {};
    move(date, sourceIndex, toIndex);
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
              <TodoItem {...item} key={item.id} sortMark={index} find={find} />
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
  const date = useTodoStore(state => state.date);
  const add = useTodoStore(state => state.add);

  const onAdd = useCallback(() => {
    if (!value) {
      return;
    }

    add(date, value);
    onChange('');
  }, [add, date, value]);

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

const Todo = ({ open = false }: { open?: boolean }) => {
  const date = useTodoStore(state => state.date);
  return (
    <div
      className={classnames(
        open ? 'w-full' : 'w-0',
        'h-full relative flex flex-col justify-center items-center duration-300 bg-red-400 space-y-4 overflow-hidden',
      )}
    >
      <div className="w-10/12 flex justify-start font-bold">{date}</div>
      <AddLine />
      <TodoList />
    </div>
  );
};

export default Todo;
