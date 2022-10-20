import { ScaleTime, axisTop, timeWeek, select } from 'd3';
import dayjs from 'dayjs';
import { useRef, useEffect } from 'react';

interface AxisTopProps {
  scale: ScaleTime<number, number>;
  transform: string;
  dates?: Date[]
}

function AxisTop({ scale, transform }: AxisTopProps) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      const axis = axisTop(scale).tickSizeInner(-50)
        .ticks(timeWeek.every(2))
        .tickFormat((d) => dayjs(d.toString()).format('YYYY MMM DD'))

      console.log(`axis.tickValues(): `, axis.tickValues());
        // .tickFormat((d: Date) => dayjs(d).format('YYYY-MM-DD')) //.ticks(5, (d) => d)
      select(ref.current).call(axis);
    }
  }, [scale]);

  return <g ref={ref} transform={transform} />;
}

export default AxisTop
