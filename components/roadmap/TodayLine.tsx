import { ScaleTime } from 'd3';

import { dayjs } from '../../lib/client/dayjs';

function TodayLine({ scale, height }: { scale: ScaleTime<number, number>; height: number }) {
  const todayX = scale(dayjs().toDate());

  return (
    <g>
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
