import { ScaleTime } from 'd3';
import { useContext } from 'react';

import { dayjs } from '../../lib/client/dayjs'
import NewRoadmapHeaderTick from './NewRoadMapHeaderTick';
import { PanContext } from './contexts';

interface AxisTopProps {
  scale: ScaleTime<number, number>;
  transform?: string;
  leftMostX: number;
  rightMostX: number;
  width: number;
}

export default function NewRoadmapHeader({ scale, transform, leftMostX, rightMostX, width }: AxisTopProps) {
  const panX = useContext(PanContext);
  let minDate = scale.domain()[0];
  let maxDate = scale.domain()[1];
  const minX = Math.min(scale(minDate), leftMostX) - panX
  const maxX = Math.max(scale(maxDate), rightMostX)

  maxDate = dayjs.max(dayjs(maxDate), dayjs(scale.invert(maxX))).toDate()
  minDate = dayjs.min(dayjs(minDate), dayjs(scale.invert(minX))).toDate()

  let xValue = minX
  const dateOfZero = scale.invert(xValue)
  const monthStartOfZero = dayjs(dateOfZero).startOf('month')
  const monthEndAfterZero = dayjs(dateOfZero).endOf('month')
  let monthStart = monthStartOfZero
  let monthEnd = monthEndAfterZero
  let middleOfMonth = dayjs(monthStart).add(15, 'day')
  const newTicks: Date[] = []

  /**
   * add a single tick for each month while xValue is less than maxX
   * This allows us to populate the dates in the header with the correct number of ticks and correct dates.
   * todo: Do this more declaratively
   */
  while (xValue < maxX*5) {
    newTicks.push(middleOfMonth.toDate())
    middleOfMonth = dayjs(monthEnd).add(15, 'day')
    monthStart = middleOfMonth.startOf('month')
    monthEnd = middleOfMonth.endOf('month')
    xValue = scale(monthEnd.toDate())
  }
  newTicks.push(middleOfMonth.toDate())

  return <g transform={transform}>
    {newTicks.map((date,i) => (<NewRoadmapHeaderTick key={i} date={date} scale={scale} y={-30} maxX={maxX} numberOfTicks={10} height={30} />))}
    {/* Render a border on the bottom of all of the labels */}
    <path d={`M${0-panX} 0 L${width-panX} 0`} style={{ fill: 'none', strokeWidth:2, stroke:'#A2D0DE' }} transform={`translate(${panX}, 0)`} />
  </g>
}

