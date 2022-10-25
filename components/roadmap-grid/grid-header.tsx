import { dayjs } from '../../lib/client/dayjs';
import styles from './Roadmap.module.css';

export function GridHeader({ ticks, index }) {
  // console.log('ticks:', ticks);

  return (
    <>
      <div key={index} className={`${styles.item} ${styles.itemHeader}`}>
        {/* <span>{dayjs(timelineTick).utc().format('YYYY-MM-DD')}</span> */}
        <span>{`Q${dayjs(ticks).utc().format('Q YYYY')}`}</span>
      </div>
    </>
  );
}
