import React, { useEffect, useState } from 'react';
import { dayjs } from '../../lib/client/dayjs';

import { globalTimeScaler } from '../../lib/client/TimeScaler';
import styles from './today-marker.module.css';
import { setShowTodayMarker, useShowTodayMarker } from '../../hooks/useShowTodayMarker';

export function TodayMarker({ ticksLength }: {ticksLength:number}) {
  const today = dayjs();
  const [percentLeft, setPercentLeft] = useState(0);
  const showTodayMarker = useShowTodayMarker();

  useEffect(() => {
    const percentage = Number((globalTimeScaler.getPercentile(today.toDate()) * 100))
    setPercentLeft(percentage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPercentLeft, today.format('YYYY-MM-DD'), globalTimeScaler.getDomain(), ticksLength]);

  return (
    <div className={styles.todayMarkerWrapper} style={{
        left: `${percentLeft}%`,
    }} onClick={() => setShowTodayMarker(!showTodayMarker)}>
      <div className={styles.todayMarkerPointer} />
      <div className={styles.todayMarker} />
    </div>
  );
}
