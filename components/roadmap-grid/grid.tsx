import styles from './Roadmap.module.css';
import {RemoveScrollBar} from 'react-remove-scroll-bar';
import { TodayMarker } from './today-marker';

export function Grid({ children, ticksLength, scroll = false }) {
  const styleClass = scroll ? styles.scrollable : styles.grid;
  return (
    <div className={styleClass} style={{ gridTemplateColumns: `repeat(${ticksLength}, minmax(10px, 1fr))` }}>
      {/* <TodayMarker /> */}
      {children}
    </div>
  );
}
