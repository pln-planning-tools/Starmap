import { Box, Text, Link, Progress } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { match } from 'path-to-regexp';
import styles from './Roadmap.module.css';
import { closestIndexTo, format, formatISO, max, min, toDate } from 'date-fns';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import minMax from 'dayjs/plugin/minMax';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import _ from 'lodash';
import { addOffset, formatDate, toTimestamp, urlMatch } from '../utils/general';

export function Roadmap({ issueData }) {
  const showGroupRowTitle = true;
  const hideMilestonesWithoutDate = true;
  const lists = (Array.isArray(issueData?.lists) && issueData?.lists?.length > 0 && issueData?.lists) || [issueData];
  console.log('lists ->', lists);
  dayjs.extend(customParseFormat);
  dayjs.extend(utc);
  dayjs.extend(minMax);
  dayjs.extend(localizedFormat);
  const dates =
    lists
      .map(
        (list) =>
          (!list?.childrenIssues && [formatDate(list.dueDate)]) ||
          list?.childrenIssues?.map((v) => formatDate(v.dueDate)),
      )
      .flat()
      .filter((v) => !!v) || lists.flatMap((v) => formatDate(v.dueDate));
  console.log('dates ->', dates);
  const getRange = (dates: any[]) => {
    const min = d3.min(dates);
    const max = d3.max(dates);
    const count = 9;
    const ticks = d3.utcTicks(min, max, count);
    // var x = d3.scaleUtc().domain([-1, 1]).range([min, max]);
    // var xTicks = x.ticks(5);
    // console.log('ticks ->', xTicks);
    const quantiles = [
      d3.quantile(ticks, 0),
      d3.quantile(ticks, 0.1),
      d3.quantile(ticks, 0.2),
      d3.quantile(ticks, 0.3),
      d3.quantile(ticks, 0.4),
      d3.quantile(ticks, 0.5),
      d3.quantile(ticks, 0.6),
      d3.quantile(ticks, 0.7),
      d3.quantile(ticks, 0.8),
      d3.quantile(ticks, 0.9),
      d3.quantile(ticks, 1),
    ];
    console.log('quantiles ->', quantiles);
    return ticks;
  };
  const getQuantiles = (ticks) => [
    d3.quantile(ticks, 0),
    // d3.quantile(ticks, 0.1),
    d3.quantile(ticks, 0.2),
    // d3.quantile(ticks, 0.3),
    d3.quantile(ticks, 0.4),
    d3.quantile(ticks, 0.5),
    d3.quantile(ticks, 0.6),
    // d3.quantile(ticks, 0.7),
    d3.quantile(ticks, 0.8),
    d3.quantile(ticks, 0.9),
    d3.quantile(ticks, 1),
  ];
  const getClosest = (dueDate, dates) => {
    const closest = (closestIndexTo(formatDate(dueDate), dates) as any) + 1;
    return (closest > 1 && closest) || 2;
  };
  const timelineTicks = (dates) => {
    const datesWithOffset = addOffset(dates);
    const range = getRange(datesWithOffset);
    return range;
  };
  const timelineQuantiles = getQuantiles(timelineTicks(dates));
  console.log(timelineQuantiles.length);

  // console.log('timelineTicks', timelineTicks(dates));
  // console.log('getQuantiles', getQuantiles(timelineTicks(dates)));

  return (
    <>
      <Box className={styles.timelineBox}>
        {!!issueData && (
          <Text mb='8px' fontSize={18} fontWeight={600}>
            <NextLink href={issueData.html_url} passHref>
              <Link color='blue.500'>{issueData?.title}</Link>
            </NextLink>
          </Text>
        )}
        <div
          style={{ gridTemplateColumns: `repeat(${timelineQuantiles.length + 1}, minmax(10px, 1fr))` }}
          className={styles.grid}
        >
          <div className={`${styles.item} ${styles.itemHeader}`}></div>
          {timelineQuantiles.map((timelineTick) => (
            <div className={`${styles.item} ${styles.itemHeader}`}>
              {/* <span>{dayjs(timelineTick).utc().format('YYYY-MM-DD')}</span> */}
              <span>{dayjs(timelineTick).utc().format('ll')}</span>
            </div>
          ))}
          {!!issueData &&
            // @ts-ignore
            lists.map((list) => (
              <div className={`${styles.nested} ${styles.subgrid} ${styles.groupWrapper}`}>
                <div className={`${styles.item} ${styles.group}`}>
                  <div>
                    {!!showGroupRowTitle && (
                      <NextLink
                        href={`/roadmap/github.com/${urlMatch(new URL(issueData.html_url).pathname).params.owner}/${
                          urlMatch(new URL(issueData.html_url).pathname).params.repo
                        }/issues/${urlMatch(new URL(issueData.html_url).pathname).params.issue_number}`}
                        passHref
                      >
                        <Link color='blue.500'>{list.title}</Link>
                      </NextLink>
                    )}
                  </div>
                </div>
                {((!!list?.childrenIssues && list?.childrenIssues) || [list]).map((issue) => (
                  <>
                    <div
                      style={{
                        gridColumn: `${getClosest(issue.dueDate, timelineQuantiles)} / span 2`,
                      }}
                      className={`${styles.item} ${styles.issueItem}`}
                    >
                      <div>
                        <NextLink
                          href={`/roadmap/github.com/${urlMatch(new URL(issue.html_url).pathname).params.owner}/${
                            urlMatch(new URL(issue.html_url).pathname).params.repo
                          }/issues/${urlMatch(new URL(issue.html_url).pathname).params.issue_number}`}
                          passHref
                        >
                          <Link color='blue.500'>{issue.title}</Link>
                        </NextLink>
                      </div>
                      <div className={styles.issueDueDate}>{issue.dueDate}</div>
                      <Progress colorScheme='green' height='26px' value={20} />
                    </div>
                  </>
                ))}
              </div>
            ))}
        </div>
      </Box>
    </>
  );
}
