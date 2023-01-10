import React, { useEffect, useState } from 'react';
import { dayjs } from '../../lib/client/dayjs';
import { Center, Text } from '@chakra-ui/react';

import { globalTimeScaler } from '../../lib/client/TimeScaler';
import styles from './today-marker.module.css';

export function TodayMarker({ ticksLength }: {ticksLength:number}) {
  const today = dayjs();
  const [percentLeft, setPercentLeft] = useState(0);
  // const [isLineVisible, setIsLineVisible] = useState(true);

  useEffect(() => {
    const percentage = Number((globalTimeScaler.getPercentile(today.toDate()) * 100))
    setPercentLeft(percentage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPercentLeft, today.format('YYYY-MM-DD'), globalTimeScaler.getDomain(), ticksLength]);

  return (
    <div className={styles.todayMarkerWrapper} style={{
        left: `${percentLeft}%`,
    }}>
      <div className={styles.todayMarkerPointer} />
      <div className={styles.todayMarker} />
      {/* <Center cursor="pointer" onClick={() => setIsLineVisible(!isLineVisible)}>
        <Text className={styles.todayMarkerText} fontSize={{ sm:"16px", md:"19px", lg:"19px" }}>TODAY</Text>
      </Center> */}
    </div>
  );
}
