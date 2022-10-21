import { Box, Text, Link, Progress } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import styles from './Roadmap.module.css';

import { formatDate, urlMatch } from '../utils/general';
import { getQuantiles } from '../lib/client/getQuantiles';
import { dayjs } from '../lib/client/dayjs';
import { timelineTicks } from '../lib/client/timelineTicks';
import { getClosest } from '../lib/client/dateUtils';

export function Roadmap({ issueData }) {
  const showGroupRowTitle = true;
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

  const timelineQuantiles = getQuantiles(timelineTicks(dates));

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
