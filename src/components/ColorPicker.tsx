import { CirclePicker, ColorChangeHandler } from 'react-color';

const ColorPicker = ({ onChange }: { onChange: ColorChangeHandler }) => {
  return <CirclePicker onChange={onChange} />;
};

export default ColorPicker;
