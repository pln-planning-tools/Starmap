import { Center } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { dayjs } from '../../lib/client/dayjs';

import { globalTimeScaler } from '../../lib/client/TimeScaler';
import styles from './today-marker.module.css';

export function TodayMarker() {
  const today = dayjs()
  const getPercentLeft = useCallback(
    (): number => Number((globalTimeScaler.getPercentile(today.toDate()) * 100).toFixed(2)),
    // using percent inverse here as a dependency to ensure the formatted date we get back is the same (i.e. the scale hasn't changed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [today.format('YYYY-MM-DD'), dayjs(globalTimeScaler.getPercentileInverse(0.5)).format('YYYY-MM-DD')]
  );
  const [percentLeft, setPercentLeft] = useState(getPercentLeft());
  const [isLineVisible, setIsLineVisible] = useState(true);

  useEffect(() => {
    setPercentLeft(getPercentLeft());
  }, [getPercentLeft, setPercentLeft]);

  return (
    <div className={styles.todayMarkerWrapper} style={{
        left: `${percentLeft}%`,
    }}>
      {isLineVisible ? <div className={styles.todayMarker} /> : null}
      <Center cursor="pointer" onClick={() => setIsLineVisible(!isLineVisible)}><div className={styles.todayMarkerText}>TODAY</div></Center>
    </div>
  );
}
