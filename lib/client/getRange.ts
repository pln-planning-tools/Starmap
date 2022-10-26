import { scaleTime, timeMonth, utcTicks } from 'd3';
import dayjs from 'dayjs';

const getRange = (dates: Date[]) => {
  const count = 10;
  // const datesInTimestamp = dates.map((date) => date.getTime());
  const min = dayjs.min(dates.map((v) => dayjs.utc(v))).toDate();
  // console.log('min:', min.getTime());
  const max = dayjs.max(dates.map((v) => dayjs.utc(v))).toDate();
  // console.log('max:', max.getTime());
  const ticks = utcTicks(min, max, count);
  // console.log('ticks:', ticks);

  var x = scaleTime().domain([min, max]).range([0, 10]);
  // console.log('date:', new Date('2022-12-31'));
  // console.log('x:', x(new Date('2022-12-31')));
  // console.log('x:', Math.round(x(new Date('2022-12-31'))));

  const newRange = timeMonth.range(min, max);
  console.log('newRange:', newRange);

  return ticks;
};

export { getRange };
