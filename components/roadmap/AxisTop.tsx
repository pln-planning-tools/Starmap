import { ScaleTime, axisTop, select, timeWeek } from 'd3';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';

import { useWeekTicks } from '../../hooks/useWeekTicks';

interface AxisTopProps {
  scale: ScaleTime<number, number>;
  transform: string;
  dates?: Date[];
}

function AxisTop({ scale, transform, dates }: AxisTopProps) {
  const ref = useRef<SVGGElement>(null);
  const numWeeks = useWeekTicks();

  console.log(`dates?.length: `, dates?.length);
  dates?.forEach((date) => {
    console.log(`date: `, dayjs(date).format('YYYY MMM DD'));
    console.log('scale for date: ', scale(date))
  })
  useEffect(() => {
    if (ref.current) {
      const axis = axisTop(scale)
        .tickSizeInner(-20)
        .ticks(3)
        .tickFormat((d, i) => i > 0 ? dayjs(d.toString()).format('YYYY MMM DD'):'')
        .tickSizeOuter(0)
        .tickPadding(10);
      // console.log(`axis: `, axis);
      // change size of ticks text

      select(ref.current).call(axis);
    }
  }, [scale, numWeeks]);
  console.log(`scale: `, scale);

  return <g ref={ref} transform={transform} />;
}

export default AxisTop;
