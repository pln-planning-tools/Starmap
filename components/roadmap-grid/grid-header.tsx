import React from 'react';

import { useDateGranularity } from '../../hooks/useDateGranularity';
import { dayjs } from '../../lib/client/dayjs';
import getDateAsQuarter from '../../lib/client/getDateAsQuarter';
import { TimeScaler } from '../../lib/client/TimeScaler';
import { DateGranularityState } from '../../lib/enums';
import { ErrorBoundary } from '../errors/ErrorBoundary';
import styles from './Roadmap.module.css';

interface GridHeaderProps {
  tick: Date;
  index: number;
  numGridCols: number;
  timeScaler: TimeScaler;
  numHeaderTicks: number;
}

/**
 * This is the labels for the grid. The quarters and the top with the tick.
 */
export function GridHeader({ tick, index, numGridCols, numHeaderTicks }: GridHeaderProps) {
  const dateGranularity = useDateGranularity();
  const date = dayjs(tick).utc();

  let label = '';
  switch (dateGranularity) {
    case DateGranularityState.Quarters:
      label = getDateAsQuarter(date);
      break;
    case DateGranularityState.Months:
    case DateGranularityState.Weeks:
    default:
      label = date.format('DD MMM YYYY');
      break;
  }

  return (

    <ErrorBoundary>
      <div key={index} className={`${styles.item} ${styles.itemHeader}`} style={{
        gridColumnEnd: `span ${numGridCols / numHeaderTicks}`,
      }}>
        <span>{label}</span>
      </div>
    </ErrorBoundary>
  );
}
