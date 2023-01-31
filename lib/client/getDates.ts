import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { DEFAULT_TICK_COUNT } from '../../config/constants';

export function getDates({ issuesGroupedState, issuesGroupedId }): Dayjs[] {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(() => {
    const today = dayjs();
    let innerDayjsDates: Dayjs[] = []
    try {
      innerDayjsDates = issuesGroupedState.value
        .flatMap((group) => group.items.map((item) => dayjs(item.due_date).utc()))
        .filter((d) => d.isValid());
    } catch {
      innerDayjsDates = []
    }
    /**
     * Add today
     */
    innerDayjsDates.push(today);

    /**
     * TODO: We need to modify today.subtract and today.add based on the current DateGranularityState
     */
    let minDate = dayjs.min([...innerDayjsDates, today.subtract(1, 'month')]);
    let maxDate = dayjs.max([...innerDayjsDates, today.add(1, 'month')]);
    let incrementMax = false

    /**
     * This is a hack to make sure that the first and last ticks are always visible.
     * TODO: Perform in constant time based on current DateGranularity
     */
    while (maxDate.diff(minDate, 'months') < (3 * DEFAULT_TICK_COUNT)) {
      if (incrementMax) {
        maxDate = maxDate.add(1, 'quarter');
      } else {
        minDate = minDate.subtract(1, 'quarter');
      }
      incrementMax = !incrementMax;
    }

    /**
     * Add minDate and maxDate so that the grid is not cut off.
     */
    innerDayjsDates.push(minDate)
    innerDayjsDates.push(maxDate)

    return innerDayjsDates;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issuesGroupedState.length, issuesGroupedId]);
}
