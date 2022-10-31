import { dayjs } from '../../lib/client/dayjs';
import styles from './Roadmap.module.css';

export function GridHeader({ ticks, index }) {
  return (
    <>
      <div key={index} className={`${styles.item} ${styles.itemHeader}`}>
        <span>{`${dayjs(ticks).utc().format('MMM DD, YYYY')}`}</span>
      </div>
    </>
  );
}
