import { timeMonth, utcTicks } from 'd3';
import dayjs from 'dayjs';

const getRange = (dates: Date[]) => {
  const count = 10;
  const min = dayjs.min(dates.map((v) => dayjs.utc(v))).toDate();
  const max = dayjs.max(dates.map((v) => dayjs.utc(v))).toDate();
  const ticks = utcTicks(min, max, count);
  const newRange = timeMonth.range(min, max);

  return ticks;
};

export { getRange };
