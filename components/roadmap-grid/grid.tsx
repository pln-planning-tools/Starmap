import styles from './Roadmap.module.css';
import { TodayMarker } from './today-marker';

export function Grid({ children, ticksLength, scroll = false, renderTodayLine = false }) {
  const styleClass = scroll ? styles.scrollable : styles.grid;
  return (
    <>
      {renderTodayLine ? <TodayMarker ticksLength={ticksLength}/> : null}
      <div className={styleClass} style={{ gridTemplateColumns: `repeat(${ticksLength}, minmax(10px, 1fr))` }}>
        {children}
      </div>
    </>
  );
}
