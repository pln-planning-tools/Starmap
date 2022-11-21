import { Box } from '@chakra-ui/react';
import { group, scaleTime } from 'd3';
import _ from 'lodash';
import { getTicks } from '../../lib/client/getTicks';
import { ViewMode } from '../../lib/enums';
import { addOffset, formatDateArrayDayJs, getInternalLinkForIssue } from '../../lib/general';
import { DetailedViewGroup, IssueData } from '../../lib/types';

import { useViewMode } from '../../hooks/useViewMode';
import styles from './Roadmap.module.css';
import { Grid } from './grid';
import { GridHeader } from './grid-header';
import { GridRow } from './grid-row';
import { GroupItem } from './group-item';
import { GroupWrapper } from './group-wrapper';
import { Headerline } from './headerline';
import { useState } from 'react';
import NumSlider from '../inputs/NumSlider';
import { setGlobalTimeScale, useGlobalTimeScale } from '../../hooks/useGlobalTimeScale';
import { dayjs } from '../../lib/client/dayjs';

export function RoadmapDetailed({
  issueData
}: {
  issueData: IssueData;
}) {

  const viewMode = useViewMode();
  const newIssueData = issueData.children.map((v) => ({
    ...v,
    group: v.parent.title,
    children: v.children.map((x) => ({ ...x, group: x.parent.title })),
  }));

  const issueDataLevelOne: IssueData[] = newIssueData.map((v) => v.children.flat()).flat();

  const issueDataLevelOneGrouped: DetailedViewGroup[] = Array.from(
    group(issueDataLevelOne, (d) => d.group),
    ([key, value]) => ({
      groupName: key,
      items: value,
      url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
    }),
  );

  const issueDataLevelOneIfNoChildren: IssueData[] = newIssueData.map((v) => ({ ...v, children: [v], group: v.title }));
  const issueDataLevelOneIfNoChildrenGrouped: DetailedViewGroup[] = Array.from(
    group(issueDataLevelOneIfNoChildren, (d) => d.group),
    ([key, value]) => ({
      groupName: key,
      items: value,
      url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
    }),
  );

  let issuesGrouped: DetailedViewGroup[];
  if (viewMode === ViewMode.Detail) {
    issuesGrouped =
      (!!issueDataLevelOneGrouped && issueDataLevelOneGrouped.length > 0 && issueDataLevelOneGrouped) ||
      issueDataLevelOneIfNoChildrenGrouped;
  } else {
    issuesGrouped = Array.from(
      group(issueData.children as IssueData[], (d) => d.group),
      ([key, value]) => ({
        groupName: key,
        items: value,
        url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
      }),
    );
  }

  const dates = formatDateArrayDayJs(issuesGrouped.map((v) => v.items.map((v) => v.due_date)).flat()).sort((a, b) => {
    return a.getTime() - b.getTime();
  });
  const datesWithOffset = addOffset(dates, { offsetStart: 6, offsetEnd: 3 }).sort((a, b) => {
    return a.getTime() - b.getTime();
  });

  const [numHeaderTicks, setNumHeaderTicks] = useState(5);
  const [numGridCols, setNumGridCols] = useState((numHeaderTicks * 5));
  const datesWithOffsetDayjs = datesWithOffset.map((v) => dayjs(v));
  const totalTimelineTicks = (numHeaderTicks * 5)
  const globalScale = scaleTime().domain([dayjs.min(datesWithOffsetDayjs), dayjs.max(datesWithOffsetDayjs)]).range([0, numGridCols]);
  setGlobalTimeScale(globalScale);

  // const ticks = getTicks(datesWithOffset, totalTimelineTicks - 1);
  const ticksHeader = getTicks(datesWithOffset, numHeaderTicks - 1);

  return (
    <>
      <NumSlider msg="how many header ticks" value={numHeaderTicks} min={5} max={60} setValue={setNumHeaderTicks}/>
      <NumSlider msg="how many grid columns" value={numGridCols} min={20} max={60} step={numHeaderTicks} setValue={setNumGridCols}/>

      <Box className={styles.timelineBox}>
        <Grid ticksLength={numGridCols}>
          {ticksHeader.map((tick, index) => (

            <GridHeader key={index} ticks={tick} index={index} numGridCols={numGridCols} />
          ))}

          <Headerline numGridCols={numGridCols}/>
        </Grid>
        <Grid ticksLength={numGridCols} scroll={true}>
          {_.reverse(Array.from(_.sortBy(issuesGrouped, ['groupName']))).map((group, index) => {
            return (
              <GroupWrapper key={index} >
                <GroupItem group={group} />
                {!!group.items &&
                  _.sortBy(group.items, ['title']).map((item, index) => {
                    return <GridRow key={index} milestone={item} index={index} timelineTicks={ticksHeader} numGridCols={numGridCols} />;
                  })}
              </GroupWrapper>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
