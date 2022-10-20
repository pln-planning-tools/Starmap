import Slider from 'react-input-slider';

import { useWeekTicks, setWeekTicks } from '../../hooks/useWeekTicks';

function WeekTicksSelector() {
  const weekTicks = useWeekTicks();

  return (
    <>
    Select week ticks (current value = {weekTicks}):  <Slider
        axis="x"
        xmax={10}
        xmin={1}
        x={weekTicks}
        onChange={({ x }) => setWeekTicks(x)}
      />
    </>
  )
}

export default WeekTicksSelector
