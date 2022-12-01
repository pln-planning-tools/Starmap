import { Center, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { globalTimeScaler } from '../../lib/client/TimeScaler';
import styles from './today-marker.module.css';

export function TodayMarker() {
  const getPercentLeft = (): number => Number((globalTimeScaler.getPercentile(new Date()) * 100).toFixed(2));
  const [percentLeft, setPercentLeft] = useState(getPercentLeft());
  const [isLineVisible, setIsLineVisible] = useState(true);

  useEffect(() => {
    setPercentLeft(getPercentLeft());
  }, [getPercentLeft, setPercentLeft, globalTimeScaler.percentageScale]);

  return (
    <div className={styles.todayMarkerWrapper} style={{
        left: `${percentLeft}%`,
    }}>
      {isLineVisible ? <div className={styles.todayMarker} /> : null}
      <Center cursor="pointer" onClick={() => setIsLineVisible(!isLineVisible)}>
        <Text className={styles.todayMarkerText} fontSize={{ sm:"16px", md:"19px", lg:"19px" }}>TODAY</Text>
      </Center>
    </div>
  );
}
