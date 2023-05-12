import { Box, Spinner, Stack, Skeleton } from '@chakra-ui/react';
import { useHookstateMemo } from '@hookstate/core';
import type { Dayjs } from 'dayjs';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

import { getTicks } from '../../lib/client/getTicks';
import { ViewMode } from '../../lib/enums';
import { IssueDataViewInput } from '../../lib/types';
import { useViewMode } from '../../hooks/useViewMode';
import styles from './Roadmap.module.css';
import { Grid } from './grid';
import { GridHeader } from './grid-header';
import { GridRow } from './grid-row';
import { GroupHeader } from './group-header';
import { GroupWrapper } from './group-wrapper';
import { Headerline } from './headerline';
import NumSlider from '../inputs/NumSlider';
import { globalTimeScaler } from '../../lib/client/TimeScaler';
import { convertIssueDataStateToDetailedViewGroupOld } from '../../lib/client/convertIssueDataToDetailedViewGroup';
import { useRouter } from 'next/router';
import { ErrorBoundary } from '../errors/ErrorBoundary';
import { useShowTodayMarker } from '../../hooks/useShowTodayMarker';
import { getDates } from '../../lib/client/getDates';
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';

// eslint-disable-next-line import/no-unused-modules
export function RoadmapDetailed({
  issueDataState
}: IssueDataViewInput) {
  /**
   * Don't commit setting this to true.. just a simple toggle so we can debug things.
   */
  const [isDevMode, _setIsDevMode] = useState(false);
  const viewMode = useViewMode() as ViewMode;
  const router = useRouter();
  const globalLoadingState = useGlobalLoadingState();
  const query = router.query
  const showTodayMarker = useShowTodayMarker();
  const issuesGroupedState = useHookstateMemo(
    () => convertIssueDataStateToDetailedViewGroupOld(issueDataState, viewMode, query),
    [viewMode, query, issueDataState]
  )

  /**
   * Magic numbers that just seem to work are:
   *  * 5 for number of header ticks
   *    * we actually want 5 visible ticks.
   *
   *  * 45 for number of grid columns
   *    * It usually works best if grid columns is easily divisble by the number of header ticks)
   *
   *  * 1.09 for a multiple of the number of grid columns
   *    * otherwise the timeScale we get back doesn't map to gridColumns well.
   */
  const [numHeaderTicks, setNumHeaderTicks] = useState(5);
  const [numGridCols, setNumGridCols] = useState(45);

  /**
   * Collect all due dates from all issues, as DayJS dates.
   */
  const dayjsDates: Dayjs[] = getDates({ issuesGroupedState })

  /**
   *  * Ensure that the dates are
   *  * converted back to JS Date objects.
   *  * sorted - d3 timescale requires it to function properly
   */
  const dates = useMemo(() => dayjsDates
    .map((date) => date.toDate())
    .sort((a, b) => a.getTime() - b.getTime()),  [dayjsDates]);

  useEffect(() => {
    globalTimeScaler.setScale(dates, numGridCols * 1.09);
  }, [dates, numGridCols]);


  // return early while loading.
  if (globalLoadingState.get()) {
    return (
      <Stack pt={"20px"}>
        <Skeleton height='60px' />
        <Skeleton height='150px' />
        <Skeleton height='150px' />
        <Skeleton height='150px' />
        <Skeleton height='150px' />
      </Stack>
    )
  }
  const invalidGroups = issuesGroupedState.filter((group) => group.ornull == null || group.items.ornull == null)
  if (issuesGroupedState.value.length === 0 || invalidGroups.length > 0) {
    if (invalidGroups.length > 0) {
      invalidGroups.forEach((g) => {
        console.warn('Found an invalid group: ', g.value);
      });
    }
    return <Spinner />;
  }

  /**
   * Current getTicks function returns 1 less than the number of ticks we want.
   */
  const ticks = getTicks(dates, numGridCols - 1);
  const ticksHeader = getTicks(dates, numHeaderTicks - 1);

  return (
    <>
      {isDevMode && <NumSlider msg="how many header ticks" value={numHeaderTicks} min={5} max={60} setValue={setNumHeaderTicks}/>}
      {isDevMode && <NumSlider msg="how many grid columns" value={numGridCols} min={20} max={60} step={numHeaderTicks} setValue={setNumGridCols} />}

      <Box className={`${styles.timelineBox} ${viewMode == 'detail' ? styles.detailView : ''}`} >
        <Grid ticksLength={numGridCols}>
          {ticksHeader.map((tick, index) => (

            <GridHeader key={index} tick={tick} index={index} numHeaderTicks={numHeaderTicks} numGridCols={numGridCols} />
          ))}

          <Headerline numGridCols={numGridCols} ticksRatio={3} />
        </Grid>
        <Grid ticksLength={numGridCols} scroll={true} renderTodayLine={showTodayMarker} >
          {issuesGroupedState.map((group, index) => (
            <ErrorBoundary key={`Fragment-${index}`} >
              <GroupHeader group={group} key={`GroupHeader-${index}`} issueDataState={issueDataState} /><GroupWrapper key={`GroupWrapper-${index}`}>
                {group.ornull != null && group.items.ornull != null &&
                  _.sortBy(group.items.ornull, ['title']).map((item, index) => <GridRow key={index} milestone={item} index={index} timelineTicks={ticks} numGridCols={numGridCols} numHeaderItems={numHeaderTicks} issueDataState={issueDataState} />)}
              </GroupWrapper>
            </ErrorBoundary>
          ))}
        </Grid>
      </Box>
    </>
  );
}

