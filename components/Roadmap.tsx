import { Box, Text, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { match } from 'path-to-regexp';
import styles from './Roadmap.module.css';

// https://github.com/pln-roadmap/tests/issues/9
const urlMatch: any = (url) => {
  // console.log('urlMatch() | url', url);
  const matchResult = match('/:owner/:repo/issues/:issue_number(\\d+)', {
    decode: decodeURIComponent,
  })(url);
  // console.log('urlMatch() | matchResult', matchResult);
  return matchResult;
};

export function Roadmap({ issueData }) {
  // console.log('inside /components/Roadmap.tsx');
  // console.log('/components/Roadmap.tsx | issueData:', issueData);
  const lists = (Array.isArray(issueData?.lists) && issueData?.lists?.length > 0 && issueData?.lists) || [issueData];
  const showGroupRowTitle = true;

  const timelineDates = [
    { month: 'January', year: '2023' },
    { month: 'February', year: '2023' },
    { month: 'March', year: '2023' },
    { month: 'April', year: '2023' },
    { month: 'May', year: '2023' },
    { month: 'June', year: '2023' },
    { month: 'July', year: '2023' },
    { month: 'August', year: '2023' },
    { month: 'September', year: '2023' },
    { month: 'October', year: '2023' },
    { month: 'November', year: '2023' },
    { month: 'December', year: '2023' },
  ];

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
        <div className={styles.grid}>
          <div className={`${styles.item} ${styles.itemHeader}`}></div>
          {timelineDates.map((timelineDate) => (
            <div className={`${styles.item} ${styles.itemHeader}`}>
              <span>{timelineDate.month}</span>
              <br />
              <span>{timelineDate.year}</span>
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
                    <div className={`${styles.item} ${styles.issueItem}`}>
                      <div>
                        {/* <NextLink
                          href={{
                            pathname: '/roadmap/github.com/[owner]/[repo]/issues/[issue_number]',
                            query: {
                              owner: urlMatch(new URL(issue.html_url).pathname).params.owner,
                              repo: urlMatch(new URL(issue.html_url).pathname).params.repo,
                              issue_number: urlMatch(new URL(issue.html_url).pathname).params.issue_number,
                            },
                          }}
                          // passHref
                        > */}
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
