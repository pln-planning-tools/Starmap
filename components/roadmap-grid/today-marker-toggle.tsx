import React from 'react';
import SvgEyeIcon from '../icons/svgr/SvgEyeIcon';
import { Text, Button } from '@chakra-ui/react';

import { setShowTodayMarker, useShowTodayMarker } from '../../hooks/useShowTodayMarker';


import styles from './today-marker.module.css';

export function TodayMarkerToggle() {
  const showTodayMarker = useShowTodayMarker();

  // const [showTodayMarker, setshowTodayMarker] = useState(false);

  return (
    <Button className={showTodayMarker ? styles.todayMarkerToggle : styles.todayMarkerToggleDisabled} onClick={() => setShowTodayMarker(!showTodayMarker)}>
      <SvgEyeIcon width={22} height={22} eyeOpen={showTodayMarker} />
      <Text fontSize={"16px"} pl={'4px'}>Today</Text>
    </Button>
  );
}
