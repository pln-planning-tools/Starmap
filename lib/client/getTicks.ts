import { utcTicks } from 'd3';

import { dayjs } from './dayjs';
import { getQuantiles } from './getQuantiles';

const getTicks = (dates: Date[], totalTicks) => {
  const count = totalTicks;
  const utcDates = dates.map((date) => dayjs(date).utc()).filter((date) => date.isValid());
  const min = dayjs.min(utcDates);
  const max = dayjs.max(utcDates);

  const ticks = utcTicks(min.toDate(), max.toDate(), count);
  const quantiles = getQuantiles(ticks, totalTicks);

  return quantiles;
};

export { getTicks };
