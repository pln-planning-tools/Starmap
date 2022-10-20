import { ScaleTime, axisTop, timeWeek, select } from 'd3';
import dayjs from 'dayjs';
import { useRef, useEffect } from 'react';
import { useWeekTicks } from '../../hooks/useWeekTicks';

interface AxisTopProps {
  scale: ScaleTime<number, number>;
  transform: string;
  dates?: Date[]
}

function AxisTop({ scale, transform }: AxisTopProps) {
  const ref = useRef<SVGGElement>(null);
  const numWeeks = useWeekTicks();

  useEffect(() => {
    if (ref.current) {
      const axis = axisTop(scale).tickSizeInner(-20)
        .tickFormat((d) => dayjs(d.toString()).format('YYYY MMM DD'))
        // .ticks(4)

      console.log(`axis.ticks(): `, axis.ticks());

      select(ref.current).call(axis);
    }
  }, [scale, numWeeks]);

  return <g ref={ref} transform={transform} />;
}

export default AxisTop
