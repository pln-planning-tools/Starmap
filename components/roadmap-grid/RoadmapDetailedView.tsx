import { Box, GridItem } from '@chakra-ui/react';

import { group } from 'd3';
import _ from 'lodash';
import React from 'react';

import { getQuantiles } from '../../lib/client/getQuantiles';
import { getRange } from '../../lib/client/getRange';
import { getTicks } from '../../lib/client/getTicks';
import { timelineTicks } from '../../lib/client/timelineTicks';
import { IssueData } from '../../lib/types';
import { addOffset, formatDateArrayDayJs } from '../../utils/general';
import styles from './Roadmap.module.css';
import { Grid } from './grid';
import { GridHeader } from './grid-header';
import { GridRow } from './grid-row';
import { GroupItem } from './group-item';
import { GroupWrapper } from './group-wrapper';
import Header from './header';
import { Headerline } from './headerline';

const quarterTicks = formatDateArrayDayJs([
  '2022-07-01T00:00:00.000Z', // Q1 2022 / 2022-01-01
  '2022-10-01T00:00:00.000Z', // Q2 2022 / 2022-04-01
  '2023-01-01T00:00:00.000Z', // Q3 2022 / 2022-07-01
  '2023-04-01T00:00:00.000Z', // Q4 2022 / 2022-10-01
  '2023-07-01T00:00:00.000Z', // Q1 2023 / 2023-01-01
]);

export function RoadmapDetailed({ issueData, viewMode }: { issueData: IssueData; viewMode: string }) {
  const showGroupRowTitle = viewMode === 'detail';
  console.log('viewMode:', viewMode);

  const groupedIssueData = Array.from(
    group(issueData.children as IssueData[], (d) => d.group),
    ([key, value]) => ({ groupName: key, items: value }),
  );

  const newIssueData = issueData.children.map((v) => ({
    ...v,
    group: v.parent.title,
    children: v.children.map((x) => ({ ...x, group: x.parent.title })),
  }));
  // console.log('newIssueData:', newIssueData);

  const issueDataLevelOne = newIssueData.map((v) => v.children.flat()).flat();
  const issueDataLevelOneGrouped = Array.from(
    group(issueDataLevelOne as IssueData[], (d) => d.group),
    ([key, value]) => ({ groupName: key, items: value }),
  );
  const issueDataLevelOneIfNoChildren = newIssueData.map((v) => ({ ...v, children: { ...v }, group: v.title }));
  const issueDataLevelOneIfNoChildrenGrouped = Array.from(
    group(issueDataLevelOneIfNoChildren as IssueData[], (d) => d.group),
    ([key, value]) => ({ groupName: key, items: value }),
  );
  // console.log('issueDataLevelOneIfNoChildren:', issueDataLevelOneIfNoChildren);
  // console.log('issueDataLevelOneIfNoChildrenGrouped:', issueDataLevelOneIfNoChildrenGrouped);
  // console.log('issueDataLevelOne:', issueDataLevelOne);
  // console.log('issueDataLevelOneGrouped:', issueDataLevelOneGrouped);
  // console.dir(issueDataLevelOneGrouped, { maxArrayLength: Infinity, depth: Infinity });

  let issuesGrouped;
  if (viewMode === 'detail') {
    issuesGrouped =
      (!!issueDataLevelOneGrouped && issueDataLevelOneGrouped.length > 0 && issueDataLevelOneGrouped) ||
      issueDataLevelOneIfNoChildrenGrouped;
  } else {
    issuesGrouped = Array.from(
      group(issueData.children as IssueData[], (d) => d.group),
      ([key, value]) => ({ groupName: key, items: value }),
    );
  }

  const dates = formatDateArrayDayJs(issuesGrouped.map((v) => v.items.map((v) => v.due_date)).flat()).sort((a, b) => {
    return a.getTime() - b.getTime();
  });
  const datesWithOffset = addOffset(dates, { offsetStart: 5, offsetEnd: 3 }).sort((a, b) => {
    return a.getTime() - b.getTime();
  });
  console.log('dates:', dates);
  console.log('datesWithOffset:', datesWithOffset);

  // const range = getRange(datesWithOffset);
  // console.log('range:', range);
  // const quantiles = getQuantiles(ticks);
  // const quantiles = getQuantiles(datesWithOffset);
  // console.log('quantiles:', quantiles);

  const ticks = getTicks(datesWithOffset, 19);
  const ticksHeader = getTicks(datesWithOffset, 4);
  console.log('ticks:', ticks);

  return (
    <>
      <Box className={styles.timelineBox}>
        <Header issueData={issueData} />
        <Grid ticksLength={ticks.length}>
          {ticksHeader.map((tick, index) => (
            <GridHeader key={index} ticks={tick} index={index} />
          ))}

          <Headerline />

          {_.reverse(Array.from(_.sortBy(issuesGrouped, ['groupName']))).map((group, index) => {
            return (
              <GroupWrapper key={index} showGroupRowTitle={showGroupRowTitle}>
                <GroupItem showGroupRowTitle={showGroupRowTitle} issueData={issueData} group={group} />
                {!!group.items &&
                  _.sortBy(group.items, ['title']).map((item, index) => {
                    return <GridRow key={index} milestone={item} index={index} timelineTicks={ticks} />;
                  })}
              </GroupWrapper>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
