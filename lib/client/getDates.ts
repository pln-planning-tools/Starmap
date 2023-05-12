import type { Dayjs } from 'dayjs';
import { DetailedViewGroup } from '../types';
import { dayjs } from './dayjs';


interface GetDatesOptions {
  issuesGroupedState: DetailedViewGroup[];
}
/**
 * Returns the dates (as dayjs dates) for all issues in all groups of an
 * issuesGroupedState object
 *
 * @returns
 */
export function getDates({ issuesGroupedState }: GetDatesOptions): Dayjs[] {
  let innerDayjsDates: Dayjs[] = []
  try {
    innerDayjsDates = issuesGroupedState
      .flatMap((group) => group.items.map((item) => dayjs(item.due_date).utc()))
      .filter((d) => d.isValid());
  } catch {
    innerDayjsDates = []
  }
  return innerDayjsDates;

}
