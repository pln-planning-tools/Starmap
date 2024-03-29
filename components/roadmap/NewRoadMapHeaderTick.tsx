import { ScaleTime } from 'd3'
import { Dayjs } from 'dayjs'

import { useMaxHeight } from '../../hooks/useMaxHeight'
import getDateAsQuarter from '../../lib/client/getDateAsQuarter'
import { TimeUnit } from '../../lib/enums'

interface NewRoadmapHeaderTickProps {
  scale: ScaleTime<number, number>;
  date: Dayjs;
  y: number;
  height: number;
  timeUnit: TimeUnit;
  maxHeight?: number;
}

export default function NewRoadmapHeaderTick ({ date, y, height, scale, timeUnit, maxHeight }: NewRoadmapHeaderTickProps) {
  const maxH = Math.max(maxHeight ?? 0, useMaxHeight())
  const startX = scale(date.startOf(timeUnit).toDate())
  const endX = scale(date.endOf(timeUnit).toDate())
  const width = (endX - startX)
  if (width < 0) return null

  let dateLabel = date.format('MMM YYYY')
  if (timeUnit === TimeUnit.Quarter) {
    dateLabel = getDateAsQuarter(date)
  } else if (timeUnit === TimeUnit.Year) {
    dateLabel = date.format('YYYY')
  }

  return <g x={startX} y={y} x2={endX}>
    <text x={startX + width / 2} y={y + height / 2 + 2} height={height} dominantBaseline='middle' textAnchor='middle'>
      {dateLabel}
    </text>
    <rect x={startX} y={y} width={width} height={height} style={{ fill: 'none', strokeWidth: 0, stroke: '#A2D0DE' }} />
    {/* Render a small line at the start of each timeUnit */}
    <path d={`M${startX} ${y + height * 0.75} L${startX} ${y + height}`} style={{ fill: 'none', strokeWidth: 1, stroke: '#A2D0DE' }} />
    {/* Render a small line at the end of each timeUnit */}
    <path d={`M${endX} ${y + height * 0.75} L${endX} ${y + height}`} style={{ fill: 'none', strokeWidth: 1, stroke: '#A2D0DE' }} />
    {/* Render a dotted line spanning the full height of the svg */}
    <path d={`M${startX} ${y + height} L${startX} ${maxH}`} style={{ fill: 'none', strokeWidth: 1, stroke: '#A2D0DE', strokeDasharray: '2,2' }} />
  </g>
}
