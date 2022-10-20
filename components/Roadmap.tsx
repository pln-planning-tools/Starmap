import { Box, Text, Link, Progress } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { match } from 'path-to-regexp';
import styles from './Roadmap.module.css';
import { closestIndexTo, format, formatISO, max, min, toDate } from 'date-fns';

import _ from 'lodash';
import { addOffset, formatDate, toTimestamp, urlMatch } from '../utils/general';
import { getRange } from '../lib/client/getRange';
import { getQuantiles } from '../lib/client/getQuantiles';
import { dayjs } from '../lib/client/dayjs';

export function Roadmap({ issueData }) {
  const showGroupRowTitle = true;
  const hideMilestonesWithoutDate = true;
  const lists = (Array.isArray(issueData?.lists) && issueData?.lists?.length > 0 && issueData?.lists) || [issueData];
  console.log('lists ->', lists);

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
          {timelineQuantiles.map((timelineTick, index) => (
            <div key={index} className={`${styles.item} ${styles.itemHeader}`}>
              {/* <span>{dayjs(timelineTick).utc().format('YYYY-MM-DD')}</span> */}
              <span>{dayjs(timelineTick).utc().format('ll')}</span>
            </div>
          ))}
          {!!issueData &&
            // @ts-ignore
            lists.map((list, index) => (
              <div key={index} className={`${styles.nested} ${styles.subgrid} ${styles.groupWrapper}`}>
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
                {((!!list?.childrenIssues && list?.childrenIssues) || [list]).map((issue, index) => (
                  <>
                    <div
                      key={index}
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
