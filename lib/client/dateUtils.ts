import { closestIndexTo } from 'date-fns';

import { formatDateDayJs } from '../../utils/general';

const getClosest = (dueDate: number | string | Date, dates: number[] | Date[]): number => {
  // const closest = (closestIndexTo(formatDate(dueDate), dates) as any) + 1;
  const closest = closestIndexTo(formatDateDayJs(dueDate as any), dates);

  // return (!!closest && closest > 1 && closest) || 2;
  return (!!closest && closest > 1 && closest) || 2;
};

export { getClosest };
