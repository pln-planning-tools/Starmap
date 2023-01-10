import { Box, Spinner } from '@chakra-ui/react';
import { useHookstate } from '@hookstate/core';
import type { Dayjs } from 'dayjs';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

import { getTicks } from '../../lib/client/getTicks';
import { ViewMode } from '../../lib/enums';
import { DetailedViewGroup, IssueDataViewInput } from '../../lib/types';
import { useViewMode } from '../../hooks/useViewMode';
import styles from './Roadmap.module.css';
import { Grid } from './grid';
import { GridHeader } from './grid-header';
import { GridRow } from './grid-row';
import { GroupHeader } from './group-header';
import { GroupWrapper } from './group-wrapper';
import { Headerline } from './headerline';
import NumSlider from '../inputs/NumSlider';
import { dayjs } from '../../lib/client/dayjs';
import { DEFAULT_TICK_COUNT } from '../../config/constants';
import { globalTimeScaler } from '../../lib/client/TimeScaler';
import { convertIssueDataStateToDetailedViewGroupOld } from '../../lib/client/convertIssueDataToDetailedViewGroup';
import { useRouter } from 'next/router';
import { ErrorBoundary } from '../errors/ErrorBoundary';
import { usePrevious } from '../../hooks/usePrevious';
import getUniqIdForGroupedIssues from '../../lib/client/getUniqIdForGroupedIssues';
import { setShowTodayMarker, useShowTodayMarker } from '../../hooks/useShowTodayMarker';

export function RoadmapDetailed({
  issueDataState
}: IssueDataViewInput) {
  /**
   * Don't commit setting this to true.. just a simple toggle so we can debug things.
   */
  const [isDevMode, _setIsDevMode] = useState(false);
  const viewMode = useViewMode() as ViewMode;
  const router = useRouter();

  const issuesGroupedState = useHookstate<DetailedViewGroup[]>([]);
  const groupedIssuesId = getUniqIdForGroupedIssues(issuesGroupedState.value)
  const groupedIssuesIdPrev = usePrevious(groupedIssuesId);
  const query = router.query
  const showTodayMarker = useShowTodayMarker();

  const setIssuesGroupedState = issuesGroupedState.set
  useEffect(() => {
    if (viewMode && groupedIssuesIdPrev !== groupedIssuesId) {
      setIssuesGroupedState(() => convertIssueDataStateToDetailedViewGroupOld(issueDataState, viewMode, query))
    }
  }, [viewMode, query, setIssuesGroupedState, issueDataState, groupedIssuesIdPrev, groupedIssuesId]);

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

  // for preventing dayjsDates from being recalculated if it doesn't need to be
  const issuesGroupedId = issuesGroupedState.value.map((g) => g.groupName).join(',');
  /**
   * Collect all due dates from all issues, as DayJS dates.
   */
  const dayjsDates: Dayjs[] = useMemo(() => {
    const today = dayjs();
    let innerDayjsDates: Dayjs[] = []
    try {
      innerDayjsDates = issuesGroupedState.value
        .flatMap((group) => group.items.map((item) => dayjs(item.due_date).utc()))
        .filter((d) => d.isValid());
    } catch {
      innerDayjsDates = []
    }
    /**
     * Add today
     */
    innerDayjsDates.push(today);

    /**
     * TODO: We need to modify today.subtract and today.add based on the current DateGranularityState
     */
    let minDate = dayjs.min([...innerDayjsDates, today.subtract(1, 'month')]);
    let maxDate = dayjs.max([...innerDayjsDates, today.add(1, 'month')]);
    let incrementMax = false

    /**
     * This is a hack to make sure that the first and last ticks are always visible.
     * TODO: Perform in constant time based on current DateGranularity
     */
    while (maxDate.diff(minDate, 'months') < (3 * DEFAULT_TICK_COUNT)) {
      if (incrementMax) {
        maxDate = maxDate.add(1, 'quarter');
      } else {
        minDate = minDate.subtract(1, 'quarter');
      }
      incrementMax = !incrementMax;
    }

    /**
     * Add minDate and maxDate so that the grid is not cut off.
     */
    innerDayjsDates.push(minDate)
    innerDayjsDates.push(maxDate)

    return innerDayjsDates;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issuesGroupedState.length, issuesGroupedId]);

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
      {isDevMode && <NumSlider msg="how many grid columns" value={numGridCols} min={20} max={60} step={numHeaderTicks} setValue={setNumGridCols}/>}

      <Box className={`${styles.timelineBox} ${ viewMode=='detail' ? styles.detailView : '' }`} >
        <Grid ticksLength={numGridCols}>
          {ticksHeader.map((tick, index) => (

            <GridHeader key={index} tick={tick} index={index} numHeaderTicks={numHeaderTicks} numGridCols={numGridCols}/>
          ))}

          <Headerline numGridCols={numGridCols} ticksRatio={3}/>
        </Grid>
        <Grid ticksLength={numGridCols} scroll={true}  renderTodayLine={showTodayMarker} >
          {issuesGroupedState.map((group, index) => (
              <ErrorBoundary key={`Fragment-${index}`} >
                <GroupHeader group={group} key={`GroupHeader-${index}`} issueDataState={issueDataState}/><GroupWrapper key={`GroupWrapper-${index}`}>
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
