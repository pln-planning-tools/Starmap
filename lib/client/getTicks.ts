import { utcTicks } from 'd3';
import dayjs from 'dayjs';

import { getQuantiles } from './getQuantiles';

const getTicks = (dates: Date[], totalTicks) => {
  const count = totalTicks;
  const min = dayjs.min(dates.map((v) => dayjs.utc(v))).toDate();
  const max = dayjs.max(dates.map((v) => dayjs.utc(v))).toDate();
  const ticks = utcTicks(min, max, count);
  const quantiles = getQuantiles(ticks, totalTicks);

  return quantiles;
};

export { getTicks };
