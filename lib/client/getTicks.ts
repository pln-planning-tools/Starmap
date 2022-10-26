import { scaleTime, timeMonth, utcTicks } from 'd3';
import dayjs from 'dayjs';

import { getQuantiles } from './getQuantiles';

const getTicks = (dates: Date[], totalTicks) => {
  // const count = 10;
  const count = totalTicks;
  const min = dayjs.min(dates.map((v) => dayjs.utc(v))).toDate();
  const max = dayjs.max(dates.map((v) => dayjs.utc(v))).toDate();
  const ticks = utcTicks(min, max, count);
  const quantiles = getQuantiles(ticks, totalTicks);
  console.log('getTicks | quantiles:', quantiles);
  // var x = scaleTime().domain([min, max]).range([0, 10]);
  // const newRange = timeMonth.range(min, max);

  return quantiles;
};

export { getTicks };
