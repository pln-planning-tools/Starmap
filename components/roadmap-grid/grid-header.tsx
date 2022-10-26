import { dayjs } from '../../lib/client/dayjs';
import styles from './Roadmap.module.css';

export function GridHeader({ ticks, index }) {
  // console.log('ticks:', ticks);
  console.log('index:', index);

  return (
    <>
      {/* <div style={{ display: 'grid', gridTemplate: 'inherit', gridGap: 'inherit', gridColumn: '1/-1' }}> */}
      <div
        key={index}
        className={`${styles.item} ${styles.itemHeader}`}
        // style={{ gridColumn: `${(index === 0 && 1) || index * 2}`, gridColumnEnd: 'span 2' }}
      >
        {/* <span>{`Q${dayjs(ticks).utc().format('Q YYYY')}`}</span> */}
        <span>{`${dayjs(ticks).utc().format('MMM DD, YYYY')}`}</span>
      </div>
      {/* </div> */}
    </>
  );
}
