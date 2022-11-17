import { utcTicks } from 'd3';

import { dayjs } from './dayjs';
import { DEFAULT_TICK_COUNT } from '../../config/constants';
import { getQuantiles } from './getQuantiles';

const getTicks = (dates: Date[], totalTicks) => {
  const count = totalTicks;
  let utcDates = dates.map((date) => dayjs(date).utc()).filter((date) => date.isValid());
  if (utcDates.length === 0) {
    utcDates = [dayjs().subtract(1, 'month').utc(), dayjs().add(1, 'month').utc()];
  }
  let min = dayjs.min(utcDates);
  let max = dayjs.max(utcDates);

  let incrementMax = false;
  /**
   * TODO: Need to update this to support date granularity
   */
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
