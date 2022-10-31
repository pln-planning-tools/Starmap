import { closestIndexTo } from 'date-fns';

import { formatDateDayJs } from '../../utils/general';

const getClosest = (dueDate: number | string | Date, dates: number[] | Date[]): number => {
  const closest = closestIndexTo(formatDateDayJs(dueDate as any), dates);

  return (!!closest && closest > 1 && closest) || 2;
};

export { getClosest };
