import { Button, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';
import SvgEyeClosedIcon from '../icons/svgr/SvgEyeClosedIcon';
import SvgEyeOpenIcon from '../icons/svgr/SvgEyeOpenIcon';

import { setShowTodayMarker, useShowTodayMarker } from '../../hooks/useShowTodayMarker';


import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import styles from './today-marker.module.css';

export function TodayMarkerToggle() {
  const showTodayMarker = useShowTodayMarker();
  const globalLoadingState = useGlobalLoadingState();

  return (
    <Skeleton isLoaded={!globalLoadingState.get()}>
      <Button
        className={showTodayMarker ? styles.todayMarkerToggle : styles.todayMarkerToggleDisabled}
        onClick={() => setShowTodayMarker(!showTodayMarker)}
      >{
        showTodayMarker ?
          <SvgEyeOpenIcon /> :
          <SvgEyeClosedIcon />
      }
      <Text fontSize={"16px"} pl={'4px'} fontWeight={500}>Today</Text>
      </Button>
    </Skeleton>
  );
}
