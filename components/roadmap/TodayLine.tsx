import { ScaleTime } from 'd3';

function TodayLine({scale, height}: {scale: ScaleTime<number, number>, height: number}) {

  const todayX = scale(new Date())

  return <line x1={todayX} x2={todayX} y1={0} y2={height} strokeWidth={2} stroke={'gray'} />;
}

export default TodayLine
