import NextLink from 'next/link';

import { Box, GridItem, Link, Text } from '@chakra-ui/react';

import { group } from 'd3';
import _ from 'lodash';
import React from 'react';

import { getClosest } from '../../lib/client/dateUtils';
import { dayjs } from '../../lib/client/dayjs';
import { IssueData } from '../../lib/types';
import { slugsFromUrl } from '../../utils/general';
import RoadmapHeader from '../roadmap/RoadmapHeader';
import styles from './Roadmap.module.css';

const getUrlPathname = (url) => {
  try {
    const urlPathname = new URL(url).pathname;
    return urlPathname;
  } catch (error) {
    console.error('error:', error);
  }
};

function Header({ issueData }) {
  return <RoadmapHeader issueData={issueData} />;
}

function GridHeader({ ticks, index }) {
  return (
    <>
      <div key={index} className={`${styles.item} ${styles.itemHeader}`}>
        <span>{`Q${dayjs(ticks).utc().format('Q YYYY')}`}</span>
      </div>
    </>
  );
}

function GroupItem({ showGroupRowTitle, issueData, group }) {
  let detailedViewClass = 'detailedView';
  if (!showGroupRowTitle) {
    detailedViewClass = '';
  }
  return (
    <div className={`${styles.item} ${styles.group}`}>
      <div>{!!showGroupRowTitle && <Text>{group.groupName}</Text>}</div>
    </div>
  );
}

function GridRow({
  milestone,
  index,
  timelineQuantiles,
}: {
  milestone: IssueData;
  index: number;
  timelineQuantiles: Date[];
}) {
  return (
    <div
      key={index}
      style={{
        gridColumn: `${getClosest(milestone.due_date, timelineQuantiles)} / span 1`,
        background: `linear-gradient(90deg, rgba(166, 255, 168, 0.4) ${parseInt(
          milestone.completion_rate.toString(0),
        )}%, white 0%, white ${100 - parseInt(milestone.completion_rate.toString(0))}%)`,
      }}
      className={`${styles.item} ${styles.issueItem}`}
    >
      <div className={styles.milestoneTitleWrapper}>
        <NextLink
          href={`/roadmap/github.com/${slugsFromUrl(getUrlPathname(milestone.html_url)).params.owner}/${
            slugsFromUrl(getUrlPathname(milestone.html_url)).params.repo
          }/issues/${slugsFromUrl(getUrlPathname(milestone.html_url)).params.issue_number}`}
          passHref
        >
          <Link color='blue.500' className={styles.milestoneTitle}>
            {milestone.title}
          </Link>
        </NextLink>
      </div>
      <div className={styles.milestoneDate}>{milestone.due_date}</div>
    </div>
  );
}

function TodayMarker() {
  return (
    <div className={styles.todayMarkerWrapper}>
      <div className={styles.todayMarker} style={{ gridColumn: '1/-1' }} />
      <div className={styles.todayMarkerText}>Today</div>
    </div>
  );
}

function Grid({ children, ticks }) {
  return (
    <div
      style={{ gridTemplateColumns: `repeat(${ticks.length}, minmax(10px, 1fr))`, marginTop: '15px' }}
      className={styles.grid}
    >
      <TodayMarker />
      {children}
    </div>
  );
}

function GroupWrapper({ children, cssName = '', showGroupRowTitle = false }) {
  let viewModeClass = 'simpleView';
  if (!!showGroupRowTitle) {
    viewModeClass = 'detailedView';
  }
  return (
    <div
      className={`${styles.nested} ${styles.subgrid} ${styles.groupWrapper} ${styles[viewModeClass]} ${styles[cssName]}`}
    >
      {children}
    </div>
  );
}

export function Roadmap({ issueData, groupBy }: { issueData: IssueData; groupBy: string }) {
  const detailedView = true;
  const groupedIssueData = Array.from(
    group(issueData.children as IssueData[], (d) => d.group),
    ([key, value]) => ({ groupName: key, items: value }),
  );

  const groupedIssueDataDetailedView = issueData.children.map((v) => ({
    groupName: v.title,
    items: v.children,
  }));

  const showGroupRowTitle = !!(groupedIssueData.length > 1);
  const groupedIssueDataItems = groupedIssueData.map((v) => v.items);
  const hideMilestonesWithoutDate = true;
  const formatDate = (date): Date => dayjs(date).utc().toDate();
  const formatDateArray = (dates): Date[] => dates.map((date) => formatDate(date));
  const dates = formatDateArray(groupedIssueData.map((v) => v.items.map((v) => v.due_date)).flat());
  const quarterTicks = formatDateArray([
    '2022-07-01T00:00:00.000Z', // Q1 2022 / 2022-01-01
    '2022-10-01T00:00:00.000Z', // Q2 2022 / 2022-04-01
    '2023-01-01T00:00:00.000Z', // Q3 2022 / 2022-07-01
    '2023-04-01T00:00:00.000Z', // Q4 2022 / 2022-10-01
    '2023-07-01T00:00:00.000Z', // Q1 2023 / 2023-01-01
  ]);

  return (
    <>
      <Box className={styles.timelineBox}>
        {!!issueData && <Header issueData={issueData} />}
        <Grid ticks={quarterTicks}>
          {quarterTicks.map((tick, index) => (
            <GridHeader ticks={tick} index={index} />
          ))}
          <GroupWrapper cssName='timelineHeaderLineWrapper'>
            <GridItem style={{ gridRow: '2/span 1' }} className={styles.timelineHeaderLine} />
            <div className={styles.timelineTick}></div>
            <div className={styles.timelineTick}></div>
            <div className={styles.timelineTick}></div>
            <div className={styles.timelineTick}></div>
            <div className={styles.timelineTick}></div>
          </GroupWrapper>
          {!!issueData &&
            _.reverse(Array.from(_.sortBy(groupedIssueData, ['groupName']))).map((group, index) => {
              return (
                <GroupWrapper showGroupRowTitle={showGroupRowTitle}>
                  <GroupItem showGroupRowTitle={showGroupRowTitle} issueData={issueData} group={group} />
                  {!!group.items &&
                    _.sortBy(group.items, ['title']).map((item, index) => {
                      return <GridRow milestone={item} index={index} timelineQuantiles={quarterTicks} />;
                    })}
                </GroupWrapper>
              );
            })}
        </Grid>
      </Box>
    </>
  );
}
