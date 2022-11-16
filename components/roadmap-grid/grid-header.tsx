import { dayjs } from '../../lib/client/dayjs';

import styles from './Roadmap.module.css';

/**
 * This is the labels for the grid. The quarters and the top with the ticks.
 * @param param0
 * @returns
 */
export function GridHeader({ ticks, index }) {
  const date = dayjs(ticks).utc();
  const quarterNum = date.quarter();
  const year = date.format('YY');

  return (
    <>
      <div key={index} className={`${styles.item} ${styles.itemHeader}`}>
        <span>{`Q${quarterNum} '${year}`}</span>
      </div>
    </>
  );
}
