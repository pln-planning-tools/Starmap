import { ScaleTime } from 'd3'
import { useMemo } from 'react'

import { dayjs } from '../../lib/client/dayjs'
import { TimeUnit } from '../../lib/enums'
import NewRoadmapHeaderTick from './NewRoadMapHeaderTick'

interface NewRoadmapHeaderProps {
  scale: ScaleTime<number, number>;
  yMin: number;
  leftMostX: number;
  rightMostX: number;
  width: number;
  maxHeight: number;
}

export default function NewRoadmapHeader ({ scale, yMin, leftMostX, rightMostX, width, maxHeight }: NewRoadmapHeaderProps) {
  const minX = leftMostX
  const maxX = rightMostX

  const maxDate = scale.invert(maxX)
  const minDate = scale.invert(minX)
  // const xDiff = scale(scale.invert(maxX)) - scale(scale.invert(minX))

  const monthDiff = useMemo(() => dayjs(maxDate).diff(dayjs(minDate), 'months'), [minDate, maxDate])
  /**
   * TODO: Be smarter about choosing the timeUnit. i.e. We should be able to
   * determine the number of ticks d3 will end up displaying, and choose
   * timeUnit based on that. Currently, this will probably have some unexpected
   * edge-cases, but should work in most cases.
   */
  const timeUnit = useMemo(() => {
    if (monthDiff >= 20) {
      return TimeUnit.Year
    } else if (monthDiff >= 14) {
      return TimeUnit.Quarter
    }
    return TimeUnit.Month
  }, [monthDiff])

  /**
   * Get an array of dates representing each timeUnit between the min and max dates
   */
  const newTicks: Date[] = useMemo(() => {
    const monthsDuration = dayjs.duration({ months: timeUnit === 'month' ? 0.5 : 2 })
    // limitExpansion is the amount of time to add to the min and max dates to ensure that the first and last ticks are visible
    const limitExpansion = dayjs.duration({ months: monthDiff })
    let timeUnitStart = dayjs(minDate).startOf(timeUnit).subtract(limitExpansion)
    const ticks: Date[] = [timeUnitStart.toDate()]
    let timeUnitEnd = timeUnitStart.endOf(timeUnit)
    let middleOfTimeUnit = dayjs(timeUnitStart).add(monthsDuration)
    const maximumTickDate = dayjs(maxDate).add(limitExpansion)
    while (middleOfTimeUnit.isBefore(maximumTickDate)) {
      ticks.push(middleOfTimeUnit.toDate())
      middleOfTimeUnit = dayjs(timeUnitEnd).add(monthsDuration)
      timeUnitStart = middleOfTimeUnit.startOf(timeUnit)
      timeUnitEnd = middleOfTimeUnit.endOf(timeUnit)
    }
    ticks.push(middleOfTimeUnit.toDate())
    return ticks
  }, [maxDate, minDate, timeUnit, monthDiff])

  return <g transform={`translate(0,${yMin})`}>
    {newTicks.map((date, i) => (<NewRoadmapHeaderTick timeUnit={timeUnit} key={i} date={date} scale={scale} y={-30} height={30} maxHeight={maxHeight} />))}
    {/* Render a border on the bottom of all of the labels */}
    <path d={`M${0} 0 L${width} 0`} style={{ fill: 'none', strokeWidth: 2, stroke: '#A2D0DE' }} />
  </g>
}
