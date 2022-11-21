import Slider from 'react-input-slider';

interface NumSelectorProps {
  value: number;
  min: number;
  max: number;
  setValue: (value: number) => void;
  msg?: string;
}

function NumSlider({value, min, max, setValue, msg}: NumSelectorProps) {
  const message = msg ?? `Select a number: `;
  return (
    <>
      <span>{message}</span>
      <Slider axis='x' xmax={max} xmin={min} x={value} onChange={({ x }) => setValue(x)} />({value})
    </>
  );
}

export default NumSlider;
