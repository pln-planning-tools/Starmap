import { ScaleTime } from 'd3'
import { Dayjs } from 'dayjs'
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
  const maxDate = scale.invert(rightMostX)
  const minDate = scale.invert(leftMostX)

  /**
   * This should be the current number of months that would be visible on the screen if we set
   * the timeUnit to TimeUnit.Month. This is used to determine the timeUnit to use.
   */
  const monthDiff = useMemo(() => dayjs(maxDate).diff(dayjs(minDate), 'months'), [minDate, maxDate])
  const monthsPerQuarter = 3
  const roughMonthTextPixelWidth = 100
  const maxMonthsOnScreen = width / roughMonthTextPixelWidth

  const timeUnit = useMemo(() => {
    if (monthDiff >= maxMonthsOnScreen * monthsPerQuarter) {
      return TimeUnit.Year
    }
    if (monthDiff >= maxMonthsOnScreen) {
      return TimeUnit.Quarter
    }

    return TimeUnit.Month
  }, [maxMonthsOnScreen, monthDiff])

  /**
   * Get an array of dates representing each timeUnit between the min and max dates
   */
  const newTicks: Dayjs[] = useMemo(() => {
    const monthsDuration = dayjs.duration({ months: timeUnit === 'month' ? 0.5 : 2 })
    // limitExpansion is the amount of time to add to the min and max dates to ensure that the first and last ticks are visible
    const limitExpansion = dayjs.duration({ months: monthDiff })
    const timeUnitStart = dayjs(minDate).startOf(timeUnit).subtract(limitExpansion)
    const ticks: Dayjs[] = [timeUnitStart]
    let timeUnitEnd = timeUnitStart.endOf(timeUnit)
    let middleOfTimeUnit = dayjs(timeUnitStart).add(monthsDuration)
    const maximumTickDate = dayjs(maxDate).add(limitExpansion)
    while (middleOfTimeUnit.isBefore(maximumTickDate)) {
      ticks.push(middleOfTimeUnit)
      middleOfTimeUnit = dayjs(timeUnitEnd).add(monthsDuration)
      timeUnitEnd = middleOfTimeUnit.endOf(timeUnit)
    }
    ticks.push(middleOfTimeUnit)
    return ticks
  }, [maxDate, minDate, timeUnit, monthDiff])

  return <g transform={`translate(0,${yMin})`}>
    {newTicks.map((date, i) => (<NewRoadmapHeaderTick timeUnit={timeUnit} key={i} date={date} scale={scale} y={-30} height={30} maxHeight={maxHeight} />))}
    {/* Render a border on the bottom of all of the labels */}
    <path d={`M${0} 0 L${width} 0`} style={{ fill: 'none', strokeWidth: 2, stroke: '#A2D0DE' }} />
  </g>
}
