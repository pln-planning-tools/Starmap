import NextLink from 'next/link';

import { Box, Link, Progress, Text } from '@chakra-ui/react';

import { closestIndexTo, format, formatISO, max, min, toDate } from 'date-fns';
import _ from 'lodash';
import { match } from 'path-to-regexp';
import React from 'react';

import { getClosest } from '../lib/client/dateUtils';
import { dayjs } from '../lib/client/dayjs';
import { getQuantiles } from '../lib/client/getQuantiles';
import { getRange } from '../lib/client/getRange';
import { timelineTicks } from '../lib/client/timelineTicks';

import { addOffset, formatDate, slugsFromUrl, toTimestamp } from '../utils/general';
import styles from './Roadmap.module.css';

const getUrlPathname = (url) => {
  try {
    const urlPathname = new URL(url).pathname;
    // console.log('urlPathname:', urlPathname);
    return urlPathname;
  } catch (error) {
    console.error('error:', error);
  }
};

export function Roadmap({ issueData, groupBy }) {
  // const showGroupRowTitle = !!(issueData.children.length > 1);
  console.log('issueData:', issueData);
  const showGroupRowTitle = false;
  console.log('showGroupRowTitle: ', showGroupRowTitle);
  const hideMilestonesWithoutDate = true;
  const lists = (Array.isArray(issueData?.children) && issueData?.children?.length > 0 && issueData?.children) || [
    issueData,
  ];
  // console.log('lists ->', lists);

  const dates =
    lists
      .map(
        (list) =>
          (!list?.children && [formatDate(list.due_date)]) || list?.children?.map((v) => formatDate(v.due_date)),
      )
      .flat()
      .filter((v) => !!v) || lists.flatMap((v) => formatDate(v.due_date));
  console.log('dates ->', dates);

  const timelineQuantiles = getQuantiles(timelineTicks(dates));

  // console.log('issueData:', issueData);
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
            lists.map((list, index) => {
              // console.log('list:', list);
              return (
                <div key={index} className={`${styles.nested} ${styles.subgrid} ${styles.groupWrapper}`}>
                  <div className={`${styles.item} ${styles.group}`}>
                    <div>
                      {!!showGroupRowTitle && (
                        <NextLink
                          href={`/roadmap/github.com/${slugsFromUrl(getUrlPathname(issueData.html_url)).params.owner}/${
                            slugsFromUrl(getUrlPathname(issueData.html_url)).params.repo
                          }/issues/${slugsFromUrl(getUrlPathname(issueData.html_url)).params.issue_number}`}
                          passHref
                        >
                          <Link color='blue.500'>{list.title}</Link>
                        </NextLink>
                      )}
                    </div>
                  </div>
                  {((!!list.children && list.children.length > 0 && list.children) || [list]).map((issue, index) => {
                    // console.log('issue:', issue);
                    return (
                      <>
                        <div
                          key={index}
                          style={{
                            gridColumn: `${getClosest(issue.due_date, timelineQuantiles)} / span 2`,
                          }}
                          className={`${styles.item} ${styles.issueItem}`}
                        >
                          <div>
                            <NextLink
                              href={`/roadmap/github.com/${slugsFromUrl(getUrlPathname(issue.html_url)).params.owner}/${
                                slugsFromUrl(getUrlPathname(issue.html_url)).params.repo
                              }/issues/${slugsFromUrl(getUrlPathname(issue.html_url)).params.issue_number}`}
                              passHref
                            >
                              <Link color='blue.500'>{issue.title}</Link>
                            </NextLink>
                          </div>
                          <div className={styles.due_date}>{issue.due_date}</div>
                          <Progress colorScheme='green' height='26px' value={20} />
                        </div>
                      </>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </Box>
    </>
  );
}
