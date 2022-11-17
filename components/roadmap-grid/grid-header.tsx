import { useDateGranularity } from '../../hooks/useDateGranularity';
import { dayjs } from '../../lib/client/dayjs';
import { DateGranularityState } from '../../lib/enums';
import { ErrorBoundary } from '../errors/ErrorBoundary';

import styles from './Roadmap.module.css';

/**
 * This is the labels for the grid. The quarters and the top with the ticks.
 * @param param0
 * @returns
 */
export function GridHeader({ ticks, index }) {
  const dateGranularity = useDateGranularity();
  const date = dayjs(ticks).utc();

  let label = '';
  switch (dateGranularity) {
    case DateGranularityState.Weeks:
    case DateGranularityState.Quarters:
      const quarterNum = date.quarter();
      const year = date.format('YYYY');
      label = `Q${quarterNum}Q ${year}`;
    case DateGranularityState.Months:
    default:
      label = date.format('MMMM YYYY');
      break;
  }

  return (

    <ErrorBoundary>
      <div key={index} className={`${styles.item} ${styles.itemHeader}`}>
        <span>{label}</span>
      </div>
    </ErrorBoundary>
  );
}
