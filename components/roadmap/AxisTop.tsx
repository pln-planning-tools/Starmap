import { ScaleTime, axisTop, select } from 'd3';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';


interface AxisTopProps {
  scale: ScaleTime<number, number>;
  transform: string;
  dates?: Date[];
}

function AxisTop({ scale, transform, dates }: AxisTopProps) {
  const ref = useRef<SVGGElement>(null);
  const numWeeks = 5

  console.log(`dates?.length: `, dates?.length);
  dates?.forEach((date) => {
    console.log(`date: `, dayjs(date).format('YYYY MMM DD'));
    console.log('scale for date: ', scale(date))
  })
  useEffect(() => {
    if (ref.current) {
      const axis = axisTop(scale)
        .tickSizeInner(-20)
        .ticks(15)
        .tickFormat((d, i) => i > 0 ? dayjs(d.toString()).format('YYYY MMM DD'):'')
        .tickSizeOuter(0)
        .tickPadding(10);
      // console.log(`axis: `, axis);
      // change size of ticks text

      select(ref.current).call(axis);
    }
  }, [scale, numWeeks, transform]);
  console.log(`scale: `, scale);

  return <g ref={ref} transform={transform} viewBox={`[${0},0, 100, 100]`}/>;
}

export default AxisTop;
