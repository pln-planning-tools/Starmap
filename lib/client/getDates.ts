import type { Dayjs, ManipulateType } from 'dayjs';
import { useMemo } from 'react';
import { dayjs } from './dayjs';
import { useDateGranularity } from '../../hooks/useDateGranularity';

export function getDates({ issuesGroupedState, issuesGroupedId, legacyView }): Dayjs[] {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dateGranularity = useDateGranularity()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(() => {
    const today = dayjs();
    let innerDayjsDates: Dayjs[] = []
    try {
      innerDayjsDates = issuesGroupedState
        .flatMap((group) => group.items.map((item) => dayjs(item.due_date).utc()))
        .filter((d) => d.isValid());
    } catch {
      innerDayjsDates = []
    }
    if (!legacyView) {
      console.log(`innerDayjsDates: `, innerDayjsDates);
      return innerDayjsDates;
    }
    /**
     * Add today
     */
    innerDayjsDates.push(today);

    /**
     * TODO: We need to modify today.subtract and today.add based on the current DateGranularityState
     */
    // let minDate = dayjs.min([...innerDayjsDates, today.subtract(1, dateGranularity as ManipulateType)]);
    // let maxDate = dayjs.max([...innerDayjsDates, today.add(1, dateGranularity as ManipulateType)]);
    let minDate = dayjs.min(innerDayjsDates);
    let maxDate = dayjs.max(innerDayjsDates);
    // let incrementMax = false
    // calculate the largest date span necessary to display all the dates so that today is always in the middle
    if (minDate.isAfter(today)) {
      maxDate = minDate.add(1, dateGranularity as ManipulateType);
    } else if (maxDate.isBefore(today)) {
      minDate = maxDate.subtract(1, dateGranularity as ManipulateType);
    } else {
      maxDate = today.add(1, dateGranularity as ManipulateType);
      minDate = today.subtract(1, dateGranularity as ManipulateType);
    }

    // ensure that the diff between today and minDate is the same as the diff between today and maxDate
    if (Math.abs(today.diff(minDate, dateGranularity as ManipulateType)) !== Math.abs(today.diff(maxDate, dateGranularity as ManipulateType))) {
        maxDate = maxDate.add(1, dateGranularity as ManipulateType);
        minDate = minDate.subtract(1, dateGranularity as ManipulateType);
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
