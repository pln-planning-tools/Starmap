import { ScaleTime } from 'd3';
import { useContext } from 'react';

import { dayjs } from '../../lib/client/dayjs';
import { PanContext } from './contexts';

function TodayLine({ scale, height }: { scale: ScaleTime<number, number>; height: number, transform?: string }) {
  const todayX = scale(dayjs().toDate());
  const panX = useContext(PanContext)

  return (
    <g transform={`translate(${panX}, 0)`}>
    {/* <g className="d3__milestoneItem__panContainer"> */}
      <text
        dominantBaseline='text-before-edge'
        x={todayX - 20}
        y={0}
        dy={'.05em'}
        fontSize={16}
        textAnchor='center'
        color='blue'
      >
        Today
      </text>

      <line x1={todayX} x2={todayX} y1={20} y2={height} strokeWidth={2} stroke={'blue'} strokeDasharray='10' />
    </g>
  );
}

export default TodayLine;
