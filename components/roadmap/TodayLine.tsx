import { ScaleTime } from 'd3';
import { useWeekTicks } from '../../hooks/useWeekTicks';

import {dayjs} from '../../lib/client/dayjs'
function TodayLine({scale, height}: {scale: ScaleTime<number, number>, height: number}) {
  // const weekTicks =
  const weekTicks = useWeekTicks();
  const todayX = scale(dayjs().toDate())

  return <line x1={todayX} x2={todayX} y1={0} y2={height} strokeWidth={2} stroke={'gray'} />;
}

export default TodayLine
