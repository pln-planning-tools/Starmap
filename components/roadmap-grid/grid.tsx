import styles from './Roadmap.module.css';
import { TodayMarker } from './today-marker';

export function Grid({ children, ticks }) {
  return (
    <div
      // style={{ gridTemplateColumns: `repeat(${ticks.length + 1}, minmax(10px, 1fr))`, marginTop: '15px' }}
      style={{ gridTemplateColumns: `repeat(${ticks.length}, minmax(10px, 1fr))`, marginTop: '15px' }}
      className={styles.grid}
    >
      <TodayMarker />
      {children}
    </div>
  );
}
