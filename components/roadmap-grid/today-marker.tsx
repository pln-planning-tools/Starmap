import styles from './Roadmap.module.css';

export function TodayMarker() {
  return (
    <div className={styles.todayMarkerWrapper}>
      <div className={styles.todayMarker} style={{ gridColumn: '1/-1' }} />
      <div className={styles.todayMarkerText}>Today</div>
    </div>
  );
}
