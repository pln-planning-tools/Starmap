import { ScaleTime, axisTop, select } from 'd3';
import { useContext, useEffect, useRef } from 'react';
import { dayjs } from '../../lib/client/dayjs'
import { useWeekTicks } from '../../hooks/useWeekTicks';
import { getTicks } from '../../lib/client/getTicks';
import NewRoadmapHeaderTick from './NewRoadMapHeaderTick';
import { PanContext } from './contexts';

interface AxisTopProps {
  scale: ScaleTime<number, number>;
  transform?: string;
  dates: Date[];
  leftMostX: number;
  rightMostX: number;
  width: number
}

export default function NewRoadmapHeader({ scale, transform, dates, leftMostX, rightMostX, width }: AxisTopProps) {
  console.log(`dates: `, dates);
  // const ref = useRef<SVGGElement>(null);
  const numWeeks = useWeekTicks();

  const panX = useContext(PanContext);
  console.log(`panX: `, panX);
  console.log(`numWeeks: `, numWeeks);
  dates = dates.sort((a, b) => a.getTime() - b.getTime())
  let minDate = scale.domain()[0];
  let maxDate = scale.domain()[1];
  const minX = Math.min(scale(minDate), leftMostX) - panX
  console.log(`minX: `, minX);
  let maxX = Math.max(scale(maxDate), rightMostX)

  // if panX < 0, then add panX to maxX
  if (panX < 0) {
    maxX -= panX
  } else {
    // maxX -= panX
  }
  maxDate = dayjs.max(dayjs(maxDate), dayjs(scale.invert(maxX))).toDate()
  minDate = dayjs.min(dayjs(minDate), dayjs(scale.invert(minX))).toDate()
  // console.log(`maxDate: `, maxDate);
  // console.log(`actualMaxDate: `, actualMaxDate);

  // const numberOfTicks = 5
  const numberOfMonths = dayjs(maxDate).diff(dayjs(minDate), 'month')
  console.log(`numberOfMonths: `, numberOfMonths);
  const ticks = getTicks(dates, numberOfMonths)
  console.log(`ticks: `, ticks);

  // console.log(`dates?.length: `, dates?.length);
  // console.log(`dates: `, dates);
  // dates?.forEach((date) => {
  //   console.log(`date: `, dayjs(date).format('YYYY MMM DD'));
  //   console.log('scale for date: ', scale(date))
  // })
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
  // console.log(`scale: `, scale);
  // const minX = 0 + panX
  let xValue = minX
  const dateOfZero = scale.invert(xValue)
  console.log(`dateOfZero: `, dateOfZero);
  const monthStartOfZero = dayjs(dateOfZero).startOf('month')
  const monthEndAfterZero = dayjs(dateOfZero).endOf('month')
  let monthStart = monthStartOfZero
  let monthEnd = monthEndAfterZero
  let middleOfMonth = dayjs(monthStart).add(15, 'day')
  const newTicks: Date[] = []
  // add a single tick for each month while xValue is less than maxX
  while (xValue < maxX) {
    newTicks.push(middleOfMonth.toDate())
    middleOfMonth = dayjs(monthEnd).add(15, 'day')
    monthStart = middleOfMonth.startOf('month')
    monthEnd = middleOfMonth.endOf('month')
    xValue = scale(monthEnd.toDate())
    console.log(`newTicks xValue vs maxX(${maxX}): `, xValue);
  }
  newTicks.push(middleOfMonth.toDate())

  console.log(`testing panning - maxX: `, maxX);
  console.log('testing panning - panX:', panX)
  return <g transform={transform}>
    {newTicks.map((date,i) => (<NewRoadmapHeaderTick key={i} date={date} scale={scale} y={-30} maxX={maxX} numberOfTicks={10} height={30} />))}
    {/* Render a border on the bottom of all of the labels */}
    <path d={`M${0-panX} 0 L${width-panX} 0`} style={{ fill: 'none', strokeWidth:2, stroke:'#A2D0DE' }} transform={`translate(${panX}, 0)`} />
  </g>
}

