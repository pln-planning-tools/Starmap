import { utcTicks } from 'd3';

import { dayjs } from './dayjs';
import { getQuantiles } from './getQuantiles';

const getTicks = (dates: Date[], totalTicks) => {
  const count = totalTicks;
  let utcDates = dates.map((date) => dayjs(date).utc()).filter((date) => date.isValid());
  let min = dayjs.min(utcDates);
  let max = dayjs.max(utcDates);

  const ticks = utcTicks(min.toDate(), max.toDate(), count);
  const quantiles = getQuantiles(ticks, totalTicks);

  return quantiles;
};

export { getTicks };
