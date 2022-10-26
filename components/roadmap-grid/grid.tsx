import styles from './Roadmap.module.css';
import { TodayMarker } from './today-marker';

export function Grid({ children, ticksLength }) {
  return (
    <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${ticksLength}, minmax(10px, 1fr))` }}>
      {/* <TodayMarker /> */}
      {children}
    </div>
  );
}
