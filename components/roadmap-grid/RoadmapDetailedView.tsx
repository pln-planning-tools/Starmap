import { Box, Spinner } from '@chakra-ui/react';
import { State, useHookstate } from '@hookstate/core';
import type { Dayjs } from 'dayjs';
import _ from 'lodash';
import React from 'react';

import { getTicks } from '../../lib/client/getTicks';
import { ViewMode } from '../../lib/enums';
import { DetailedViewGroup, IssueData, IssueDataViewInput } from '../../lib/types';
import { useViewMode } from '../../hooks/useViewMode';
import styles from './Roadmap.module.css';
import { Grid } from './grid';
import { GridHeader } from './grid-header';
import { GridRow } from './grid-row';
import { GroupHeader } from './group-header';
import { GroupWrapper } from './group-wrapper';
import { Headerline } from './headerline';
import React, { useState } from 'react';
import NumSlider from '../inputs/NumSlider';
import { dayjs } from '../../lib/client/dayjs';
import { DEFAULT_TICK_COUNT } from '../../config/constants';
import { globalTimeScaler } from '../../lib/client/TimeScaler';
<<<<<<< HEAD
import { convertIssueDataStateToDetailedViewGroupOld } from '../../lib/client/convertIssueDataToDetailedViewGroup';
=======
>>>>>>> main

export function RoadmapDetailed({
  issueDataState
}: IssueDataViewInput) {
  /**
   * Don't commit setting this to true.. just a simple toggle so we can debug things.
   */
<<<<<<< HEAD
  const [isDevMode, setIsDevMode] = useState(false);
  const viewMode = useViewMode() as ViewMode;

  const issuesGroupedState = useHookstate<DetailedViewGroup[]>([]);
  // const [dayjsDates, setDayjsDates] = useState<Dayjs[]>([]);

  useEffect(() => {
    if (viewMode) {
      issuesGroupedState.set(convertIssueDataStateToDetailedViewGroupOld(issueDataState, viewMode))
    }
  }, [viewMode, issueDataState.value]);

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

=======
  const [isDevMode] = useState(false);
  const viewMode = useViewMode();
  const newIssueData = issueData.children.map((v) => ({
    ...v,
    group: v.parent.title,
    children: v.children.map((x) => ({ ...x, group: x.parent.title })),
  }));

  const issueDataMapper = ([key, value]) => {
    const roadmapChild = newIssueData.find((i) => i.title === key) || '';
    return {
      groupName: key,
      items: value,
      url: roadmapChild === '' ? '' : getLinkForRoadmapChild(roadmapChild),
    }
  };

  const issueDataLevelOne: IssueData[] = newIssueData.map((v) => v.children.flat()).flat();

  const issueDataLevelOneGrouped: DetailedViewGroup[] = Array.from(
    group(issueDataLevelOne, (d) => d.group),
    issueDataMapper
  );

  const issueDataLevelOneIfNoChildren: IssueData[] = newIssueData.map((v) => ({ ...v, group: v.title }));

  const issueDataLevelOneIfNoChildrenGrouped: DetailedViewGroup[] = Array.from(
    group(issueDataLevelOneIfNoChildren, (d) => d.group),
    issueDataMapper
  );

  let issuesGrouped: DetailedViewGroup[];
  if (viewMode === ViewMode.Detail) {
    issuesGrouped =
      (!!issueDataLevelOneGrouped && issueDataLevelOneGrouped.length > 0 && issueDataLevelOneGrouped) ||
      issueDataLevelOneIfNoChildrenGrouped;
  } else {
    issuesGrouped = Array.from(
      group(issueData.children as IssueData[], (d) => d.group),
      issueDataMapper
    );
  }
>>>>>>> main

  const today = dayjs();

  /**
   * Collect all due dates from all issues, as DayJS dates.
   */
  let dayjsDates: Dayjs[] = []
  // useEffect(() => {
    try {
      dayjsDates = issuesGroupedState.value
        .flatMap((group) => group.items.map((item) => dayjs(item.due_date).utc()))
        .filter((d) => d.isValid());
      // setDayjsDates(dayjsDates);
    } catch {
      // setDayjsDates([])
      dayjsDates=[]
    }

  // }, [issuesGroupedState.value])

  if (issuesGroupedState.value.length === 0) {
    return <Spinner />
  }

  /**
   * Add today
   */
  dayjsDates.push(today);

  /**
   * TODO: We need to modify today.subtract and today.add based on the current DateGranularityState
   */
  let minDate = dayjs.min([...dayjsDates, today.subtract(1, 'month')])
  let maxDate = dayjs.max([...dayjsDates, today.add(1, 'month')])
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
  dayjsDates.push(minDate)
  dayjsDates.push(maxDate)

  /**
   *  * Ensure that the dates are
   *  * converted back to JS Date objects.
   *  * sorted - d3 timescale requires it to function properly
   */
  const dates = dayjsDates
    .map((date) => date.toDate())
    .sort((a, b) => a.getTime() - b.getTime());

  globalTimeScaler.setScale(dates, numGridCols * 1.09);

  /**
   * Current getTicks function returns 1 less than the number of ticks we want.
   */
  const ticks = getTicks(dates, numGridCols - 1);
  const ticksHeader = getTicks(dates, numHeaderTicks - 1);

  return (
    <>
      {isDevMode && <NumSlider msg="how many header ticks" value={numHeaderTicks} min={5} max={60} setValue={setNumHeaderTicks}/>}
      {isDevMode && <NumSlider msg="how many grid columns" value={numGridCols} min={20} max={60} step={numHeaderTicks} setValue={setNumGridCols}/>}

      <Box className={styles.timelineBox}>
        <Grid ticksLength={numGridCols}>
          {ticksHeader.map((tick, index) => (

            <GridHeader key={index} tick={tick} index={index} numHeaderTicks={numHeaderTicks} numGridCols={numGridCols} timeScaler={globalTimeScaler}/>
          ))}

          <Headerline numGridCols={numGridCols} ticksRatio={3}/>
        </Grid>
        <Grid ticksLength={numGridCols} scroll={true}  renderTodayLine={true} >
<<<<<<< HEAD
          {issuesGroupedState.map((group, index) => {
            return (
              <React.Fragment key={`Fragment-${index}`} >
                <GroupHeader group={group} key={`GroupHeader-${index}`}/><GroupWrapper key={`GroupWrapper-${index}`}>
                  {!!group.items.value &&
                    _.sortBy(group.items, ['title']).map((item, index) => {
                      return <GridRow key={index} timeScaler={globalTimeScaler} milestone={item.value} index={index} timelineTicks={ticks} numGridCols={numGridCols} numHeaderItems={numHeaderTicks} />;
                    })}
=======
          {_.reverse(Array.from(_.sortBy(issuesGrouped, ['groupName']))).map((group, index) => (
              <React.Fragment key={`Fragment-${index}`} >
                <GroupHeader group={group} key={`GroupHeader-${index}`}/><GroupWrapper key={`GroupWrapper-${index}`}>
                  {!!group.items &&
                    _.sortBy(group.items, ['title']).map((item, index) => <GridRow key={index} timeScaler={globalTimeScaler} milestone={item} index={index} timelineTicks={ticks} numGridCols={numGridCols} numHeaderItems={numHeaderTicks} />)}
>>>>>>> main
                </GroupWrapper>
              </React.Fragment>
            ))}
        </Grid>
      </Box>
    </>
  );
}
