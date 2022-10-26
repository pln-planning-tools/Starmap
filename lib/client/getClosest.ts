import { scaleTime } from 'd3';
import dayjs from 'dayjs';

export function getClosest({
  currentDate,
  dates,
  totalTimelineTicks,
}: {
  currentDate: Date;
  dates: Date[];
  totalTimelineTicks: number;
}) {
  const min = dayjs.min(dates.map((v) => dayjs.utc(v))).toDate();
  const max = dayjs.max(dates.map((v) => dayjs.utc(v))).toDate();
  const closest = scaleTime().domain([min, max]).range([0, totalTimelineTicks]);

  return Math.round(closest(currentDate));
}
