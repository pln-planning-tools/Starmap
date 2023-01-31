import { ScaleTime, axisTop, select } from 'd3';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';

import { useWeekTicks } from '../../hooks/useWeekTicks';

interface NewRoadmapHeaderTickProps {
  scale: ScaleTime<number, number>;
  date: Date;
  // x: number;
  y: number;
  // width: number;
  height: number;
  maxX: number;
  numberOfTicks: number;
}

export default function NewRoadmapHeaderTick({ date,  y,  height, scale, maxX, numberOfTicks }: NewRoadmapHeaderTickProps) {
  // const x= scale(date)
  const startX = scale(dayjs(date).startOf('month'))
  const endX = scale(dayjs(date).endOf('month'))
  // const width = maxX / numberOfTicks + 1
  const width = endX - startX
  return <g x={startX} y={y} x2={endX}>
    <text x={startX + width/2} y={y + height/2} dominantBaseline='middle' textAnchor='middle'>
      {dayjs(date).format('MMM YYYY')}
    </text>
    <rect x={startX} y={y} width={width} height={height} style={{ fill: 'none', strokeWidth:1, stroke:'rgb(0,0,0)' }} />
  </g>
}

