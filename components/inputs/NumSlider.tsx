import Slider from 'react-input-slider';

interface NumSelectorProps {
  value: number;
  min: number;
  max: number;
  setValue: (value: number) => void;
  msg?: string;
  step?: number;
}

function NumSlider({value, min, max, setValue, msg, step}: NumSelectorProps) {
  const message = msg ?? `Select a number: `;
  step = step ?? 1;
  return (
    <>
      <span>{message}</span>
      <Slider axis='x' xstep={step} xmax={max} xmin={min} x={value} onChange={({ x }) => setValue(x)} />({value})
    </>
  );
}

export default NumSlider;
