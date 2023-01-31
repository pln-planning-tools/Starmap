import { ScaleTime, axisTop, select } from 'd3';
import { useEffect, useRef } from 'react';
import { dayjs } from '../../lib/client/dayjs'
import { useWeekTicks } from '../../hooks/useWeekTicks';
import { getTicks } from '../../lib/client/getTicks';
import NewRoadmapHeaderTick from './NewRoadMapHeaderTick';

interface AxisTopProps {
  scale: ScaleTime<number, number>;
  transform: string;
  dates: Date[];
}

export default function NewRoadmapHeader({ scale, transform, dates }: AxisTopProps) {
  console.log(`dates: `, dates);
  // const ref = useRef<SVGGElement>(null);
  const numWeeks = useWeekTicks();
  console.log(`numWeeks: `, numWeeks);
  dates = dates.sort((a, b) => a.getTime() - b.getTime())
  const maxDate = scale.domain()[1];
  const maxX = scale(maxDate);
  // const numberOfTicks = 5
  const numberOfMonths = dayjs(scale.domain()[1]).diff(dayjs(scale.domain()[0]), 'month')
  console.log(`numberOfMonths: `, numberOfMonths);
  const ticks = getTicks(dates, numberOfMonths)
  console.log(`ticks: `, ticks);

  // console.log(`dates?.length: `, dates?.length);
  // console.log(`dates: `, dates);
  dates?.forEach((date) => {
    console.log(`date: `, dayjs(date).format('YYYY MMM DD'));
    console.log('scale for date: ', scale(date))
  })
  // useEffect(() => {
  //   if (ref.current) {
  //     const axis = axisTop(scale)
  //       .tickSizeInner(-20)
  //       .ticks(3)
  //       .tickFormat((d, i) => i > 0 ? dayjs(d.toString()).format('YYYY MMM DD'):'')
  //       .tickSizeOuter(0)
  //       .tickPadding(10);
  //     // console.log(`axis: `, axis);
  //     // change size of ticks text

  //     select(ref.current).call(axis);
  //   }
  // }, [scale, numWeeks]);
  console.log(`scale: `, scale);
  let xValue = 0
  const dateOfZero = scale.invert(xValue)
  const monthStartOfZero = dayjs(dateOfZero).startOf('month')
  const monthEndAfterZero = dayjs(dateOfZero).endOf('month')
  let monthStart = monthStartOfZero
  let monthEnd = monthEndAfterZero
  let middleOfMonth = dayjs(monthStart).add(15, 'day')
  const newTicks: Date[] = []
  // add a single tick for each month while xValue is less than maxX
  while(xValue <= maxX) {
    newTicks.push(middleOfMonth.toDate())
    middleOfMonth = dayjs(monthEnd).add(15, 'day')
    monthStart = middleOfMonth.startOf('month')
    monthEnd = middleOfMonth.endOf('month')
    xValue = scale(monthEnd.toDate())
    console.log(`newTicks xValue vs maxX(${maxX}): `, xValue);
  }
  newTicks.push(middleOfMonth.toDate())

  return <g transform={transform}>
    {newTicks.map((date,i) => (<NewRoadmapHeaderTick key={i} date={date} scale={scale} y={-30} maxX={maxX} numberOfTicks={numberOfMonths} height={30} />))}
    {/* Render a border on the bottom of all of the labels */}
    <path d={`M0 0 L${maxX} 0`} style={{ fill: 'none', strokeWidth:2, stroke:'#A2D0DE' }} />
  </g>
}

