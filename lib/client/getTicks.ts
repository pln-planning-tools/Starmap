import { utcTicks } from 'd3';
import dayjs from 'dayjs';
import { DEFAULT_TICK_COUNT } from '../../config/constants';
import { getQuantiles } from './getQuantiles';

const getTicks = (dates: Date[], totalTicks) => {
  const count = totalTicks;
  const utcDates = dates.map((date) => dayjs(date).utc());
  let min = dayjs.min(utcDates);
  let max = dayjs.max(utcDates);
  let incrementMax = false;
  while (max.diff(min, 'months') < (3 * DEFAULT_TICK_COUNT)) {
    if (incrementMax) {
      max = max.add(1, 'quarter');
    } else {
      min = min.subtract(1, 'quarter');
    }
    incrementMax = !incrementMax;
  }

  const ticks = utcTicks(min.toDate(), max.toDate(), count);
  const quantiles = getQuantiles(ticks, totalTicks);

  return quantiles;
};

export { getTicks };
