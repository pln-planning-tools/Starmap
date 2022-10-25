import { Box, GridItem } from '@chakra-ui/react';

import { group } from 'd3';
import _ from 'lodash';
import React from 'react';

import { IssueData } from '../../lib/types';
import { formatDateArrayDayJs } from '../../utils/general';
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

export function RoadmapDetailed({ issueData }: { issueData: IssueData }) {
  const showGroupRowTitle = true;

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
  // console.log('issueDataLevelOne:', issueDataLevelOne);
  // console.log('issueDataLevelOneGrouped:', issueDataLevelOneGrouped);
  // console.dir(issueDataLevelOneGrouped, { maxArrayLength: Infinity, depth: Infinity });

  return (
    <>
      <Box className={styles.timelineBox}>
        <Header issueData={issueData} />
        <Grid ticks={quarterTicks}>
          {quarterTicks.map((tick, index) => (
            <GridHeader key={index} ticks={tick} index={index} />
          ))}

          <Headerline />

          {_.reverse(Array.from(_.sortBy(issueDataLevelOneGrouped, ['groupName']))).map((group, index) => {
            return (
              <GroupWrapper key={index} showGroupRowTitle={showGroupRowTitle}>
                <GroupItem showGroupRowTitle={showGroupRowTitle} issueData={issueData} group={group} />
                {!!group.items &&
                  _.sortBy(group.items, ['title']).map((item, index) => {
                    return <GridRow key={index} milestone={item} index={index} timelineQuantiles={quarterTicks} />;
                  })}
              </GroupWrapper>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
