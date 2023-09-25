// const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const block = new Array(6).fill('').map(_ => new Array(7).fill(''));

const BlockItem = ({ children }: { children: string }) => {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
};

const Calendar = ({ data }: { data: string[][] }) => {
  return (
    <div>
      {data.map(item => (
        <div key={item.toString()}>
          {item.map(item2 => (
            <BlockItem key={item2}>{item2}</BlockItem>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Calendar;
