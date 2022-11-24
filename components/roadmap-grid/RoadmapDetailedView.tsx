import { Box } from '@chakra-ui/react';
import { group } from 'd3';
import _, { groupBy } from 'lodash';
import { getTicks } from '../../lib/client/getTicks';
import { ViewMode } from '../../lib/enums';
import { getInternalLinkForIssue } from '../../lib/general';
import { DetailedViewGroup, IssueData } from '../../lib/types';

import { useViewMode } from '../../hooks/useViewMode';
import styles from './Roadmap.module.css';
import { Grid } from './grid';
import { GridHeader } from './grid-header';
import { GridRow } from './grid-row';
import { GroupItem } from './group-item';
import { GroupWrapper } from './group-wrapper';
import { Headerline } from './headerline';
import { useEffect, useState } from 'react';
import NumSlider from '../inputs/NumSlider';
import { dayjs } from '../../lib/client/dayjs';
import { DEFAULT_TICK_COUNT } from '../../config/constants';
import { globalTimeScaler } from '../../lib/client/TimeScaler';
import { State, useHookstate } from '@hookstate/core';
import { convertIssueDataToDetailedViewGroup, convertIssueDataToDetailedViewGroupOld } from '../../lib/client/convertIssueDataToDetailedViewGroup';

export function RoadmapDetailed({
  issueDataState,
  numChanges,
}: {
  issueDataState: State<IssueData>;
  numChanges: number;
}) {
  /**
   * Don't commit setting this to true.. just a simple toggle so we can debug things.
   */
  const [isDevMode, setIsDevMode] = useState(false);
  // const [issuesGrouped, setIssuesGrouped] = useState<DetailedViewGroup[]>([])
  console.log(`debug issuesGrouped - RoadmapDetailed numChanges: `, numChanges);
  const viewMode = useViewMode();
  const childrenIssues = useHookstate(issueDataState.children);
  const issuesGrouped = useHookstate<DetailedViewGroup[]>([])
  console.log(`debug issuesGrouped - childrenIssues: `, childrenIssues.get({noproxy: true}));
  if (viewMode != null) {
    issuesGrouped.set(convertIssueDataToDetailedViewGroupOld(issueDataState.get(), viewMode));
  }

  useEffect(() => {
    console.log('debug issuesGrouped - useEffect - JSON issuesGrouped', JSON.stringify(issuesGrouped.get({noproxy: true}), null, 2));
    console.log('debug issuesGrouped - useEffect - JSON issueData', JSON.stringify(issueDataState.get({noproxy: true}), null, 2));

  }, [issueDataState.get({noproxy: true})])



  const today = dayjs();
  /**
   * Collect all due dates from all issues, as DayJS dates.
   */
  const dayjsDates = (issuesGrouped.get() as DetailedViewGroup[] ?? [])
    .flatMap((group) => group.items.map((item) => dayjs(item.due_date).utc()))
    .filter((d) => d.isValid());

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
   * Ensure that the dates are
   *  * converted back to JS Date objects.
   *  * sorted - d3 timescale requires it to function properly
   */
  const dates = dayjsDates
    .map((date) => date.toDate())
    .sort((a, b) => {
      return a.getTime() - b.getTime();
    });

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
          {issuesGrouped.map((group, index) => {
            console.log('roadmap detailed view', group.get(), index);
            return (
              <GroupWrapper key={index} >
                <GroupItem group={group.get()} />
                {!!group.items &&
                  _.sortBy(group.items, ['title']).map((item, index) => {
                    return <GridRow key={index} timeScaler={globalTimeScaler} milestone={item.get()} index={index} timelineTicks={ticks} numGridCols={numGridCols} numHeaderItems={numHeaderTicks}/>;
                  })}
              </GroupWrapper>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
