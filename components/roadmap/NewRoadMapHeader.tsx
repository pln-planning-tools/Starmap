import { ScaleTime } from 'd3';
import { useContext, useEffect, useMemo, useState } from 'react';

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
  const [timeUnit, setTimeUnit] = useState<'quarter' | 'month'>('month')
  let minDate = scale.domain()[0];
  let maxDate = scale.domain()[1];
  const minX = Math.min(scale(minDate), leftMostX) - Math.abs(panX)
  const maxX = Math.max(scale(maxDate), rightMostX) // + Math.abs(panX)

  maxDate = dayjs.max(dayjs(maxDate), dayjs(scale.invert(maxX))).toDate()
  minDate = dayjs.min(dayjs(minDate), dayjs(scale.invert(minX))).toDate()

  /**
   * Get an array of dates representing each timeUnit between the min and max dates
   */
  const newTicks: Date[] = useMemo(() => {
    const ticks: Date[] = []
    const monthsDuration = timeUnit === 'month' ? 0.5 : 2
    let timeUnitStart = dayjs(minDate).startOf(timeUnit)
    let timeUnitEnd = dayjs(minDate).endOf(timeUnit)
    let middleOfTimeUnit = dayjs(timeUnitStart).add(dayjs.duration({ months: monthsDuration }))
    while (timeUnitEnd.isBefore(dayjs(maxDate))) {
      ticks.push(middleOfTimeUnit.toDate())
      middleOfTimeUnit = dayjs(timeUnitEnd).add(dayjs.duration({ months: monthsDuration }))
      timeUnitStart = middleOfTimeUnit.startOf(timeUnit)
      timeUnitEnd = middleOfTimeUnit.endOf(timeUnit)
    }
    ticks.push(middleOfTimeUnit.toDate())
    return ticks;
  }, [maxDate, minDate, timeUnit])

  const monthsBetweenTicks = useMemo(() => {
    const newTicksMin = dayjs.min(newTicks.map(tick => dayjs(tick)))
    const newTicksMax = dayjs.max(newTicks.map(tick => dayjs(tick)))

    return newTicksMax.diff(newTicksMin, 'month')
  }, [newTicks])

  useEffect(() => {
    /**
     * need a smarter way to do this.. there's currently no guarantee that we
     * won't flip timeUnit back and forth under certain conditions
     */
    // console.log(`monthsBetweenTicks: `, monthsBetweenTicks);
    if (monthsBetweenTicks >= 14) {
      setTimeUnit('quarter')
    } else {
      setTimeUnit('month')
    }
  }, [monthsBetweenTicks])

  return <g transform={transform}>
    {newTicks.map((date,i) => (<NewRoadmapHeaderTick timeUnit={timeUnit} key={i} date={date} scale={scale} y={-30} maxX={maxX} height={30} />))}
    {/* Render a border on the bottom of all of the labels */}
    <path d={`M${0-panX} 0 L${width-panX} 0`} style={{ fill: 'none', strokeWidth:2, stroke:'#A2D0DE' }} transform={`translate(${panX}, 0)`} />
  </g>
}

