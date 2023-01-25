import React from 'react';

import { useDateGranularity } from '../../hooks/useDateGranularity';
import { dayjs } from '../../lib/client/dayjs';
import getDateAsQuarter from '../../lib/client/getDateAsQuarter';
import { DateGranularityState } from '../../lib/enums';
import { ErrorBoundary } from '../errors/ErrorBoundary';
import styles from './Roadmap.module.css';
import { Text } from '@chakra-ui/react';

interface GridHeaderProps {
  tick: Date;
  index: number;
  numGridCols: number;
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
      }} >
        <Text fontSize={{ sm:"15px", md:"16px", lg:"16px" }}>{label}</Text>
      </div>
    </ErrorBoundary>
  );
}
