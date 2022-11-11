import { Box } from '@chakra-ui/react';

import { group } from 'd3';
import _ from 'lodash';
import React from 'react';

import { getTicks } from '../../lib/client/getTicks';
import { IssueData, IssueDataGrouped } from '../../lib/types';
import { addOffset, formatDateArrayDayJs } from '../../utils/general';
import styles from './Roadmap.module.css';
import { Grid } from './grid';
import { GridHeader } from './grid-header';
import { GridRow } from './grid-row';
import { GroupItem } from './group-item';
import { GroupWrapper } from './group-wrapper';
import Header from './header';
import { Headerline } from './headerline';

// const groupData = (data) => '';

const addGroupWithParentTitle = (data: IssueData): IssueData[] =>
  data.children.map((v) => ({
    ...v,
    group: v.parent.title,
    children: v.children.map((x) => ({ ...x, group: x.parent.title })),
  }));

const groupData = (data: IssueData[]): IssueDataGrouped[] =>
  Array.from(
    group(data, (d) => d.group),
    ([key, value]) => ({ groupName: key, items: value }),
  );

export function RoadmapGrid({ issueData, viewMode }: { issueData: IssueData; viewMode: string }) {
  let issue: IssueData;
  if (issueData.children.length === 0) {
    issue = { ...issueData, children: [{ ...issueData }] };
  } else {
    issue = issueData;
  }
  console.log('issue:', issue);
  const showGroupRowTitle = viewMode === 'detail';
  console.log('viewMode:', viewMode);

  const issueDataLevelOne = addGroupWithParentTitle(issue)
    .map((data) => data.children.flat())
    .flat();
  const issueDataLevelOneGrouped = groupData(issueDataLevelOne);
  const issueDataLevelOneIfNoChildren = addGroupWithParentTitle(issue).map((data) => ({
    ...data,
    children: [{ ...data }],
    group: data.title,
  }));
  // console.log('issueDataLevelOneIfNoChildren:', issueDataLevelOneIfNoChildren);
  const issueDataLevelOneIfNoChildrenGrouped = groupData(issueDataLevelOneIfNoChildren);

  let issuesGrouped;
  if (viewMode === 'detail') {
    issuesGrouped =
      (!!issueDataLevelOneGrouped && issueDataLevelOneGrouped.length > 0 && issueDataLevelOneGrouped) ||
      issueDataLevelOneIfNoChildrenGrouped;
  } else {
    issuesGrouped = groupData(issue.children);
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
        <Header issueData={issue} />
        <Grid ticksLength={ticks.length}>
          {ticksHeader.map((tick, index) => (
            <GridHeader key={index} ticks={tick} index={index} />
          ))}

          <Headerline />

          {_.reverse(Array.from(_.sortBy(issuesGrouped, ['groupName']))).map((group, index) => {
            return (
              <GroupWrapper key={index} showGroupRowTitle={showGroupRowTitle}>
                <GroupItem showGroupRowTitle={showGroupRowTitle} issueData={issue} group={group} />
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
