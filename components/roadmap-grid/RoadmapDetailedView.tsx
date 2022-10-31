import { Box } from '@chakra-ui/react';

import { group } from 'd3';
import _ from 'lodash';
import React from 'react';

import { getTicks } from '../../lib/client/getTicks';
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

export function RoadmapDetailed({ issueData, viewMode }: { issueData: IssueData; viewMode: string }) {
  const showGroupRowTitle = viewMode === 'detail';
  console.log('viewMode:', viewMode);

  const newIssueData = issueData.children.map((v) => ({
    ...v,
    group: v.parent.title,
    children: v.children.map((x) => ({ ...x, group: x.parent.title })),
  }));

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
  const datesWithOffset = addOffset(dates, { offsetStart: 6, offsetEnd: 3 }).sort((a, b) => {
    return a.getTime() - b.getTime();
  });

  const ticks = getTicks(datesWithOffset, 19);
  const ticksHeader = getTicks(datesWithOffset, 4);

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
