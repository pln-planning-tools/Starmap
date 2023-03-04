import React from 'react';
import { IssueData, IssueDataViewInput } from '../../lib/types';

import styles from './RoadmapList.module.css';
import { Divider, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import RoadmapListItem from './RoadmapListItem';
import { dayjs } from '../../lib/client/dayjs';
import { ImmutableObject } from '@hookstate/core';

interface RoadmapListProps extends IssueDataViewInput {
  maybe?: unknown
}

function getFlattenedIssues(issueDataState) {
  // const issueData = issueDataState.get({ noproxy: true });
  const flattenedIssues: IssueData[] = issueDataState.children.flatMap((issueData) => {
    console.log(`issueData: `, issueData);
    return [issueData.get({ noproxy: true }), ...getFlattenedIssues(issueData)]
  })
  return flattenedIssues
}

function sortMilestones (a, b) {
    if (a.due_date.length === 0) {
      // a has an invalid ETA, so it should be sorted to the end
      return 1
    } else if (b.due_date.length === 0) {
      // b has an invalid ETA, so it should be sorted to the end
      return -1
    }
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  }

// eslint-disable-next-line import/no-unused-modules
export default function RoadmapList({ issueDataState }: RoadmapListProps): JSX.Element {
  const [groupBy, setGroupBy] = React.useState('directChildren')

  const rootIssueTitle = issueDataState.get({ noproxy: true }).title;
  const rootIssueDescription = issueDataState.get({ noproxy: true }).description;
  console.log(`RoadmapList issueDataState: `, issueDataState.get({ noproxy: true }));
  // const flattenedIssues = getFlattenedIssues(issueDataState);
  // console.log(`RoadmapList flattenedIssues: `, flattenedIssues);
  const flattenedIssues = issueDataState.children.flatMap((issueData) => issueData.get({ noproxy: true }))
  // const { issuesWithDueDates, issuesWithoutDueDates } = flattenedIssues.reduce((acc, issue) => {
  //   if (issue.due_date.length > 0) {
  //     acc.issuesWithDueDates.push(issue)
  //   } else {
  //     acc.issuesWithoutDueDates.push(issue)
  //   }
  //   return acc
  // }, { issuesWithDueDates: [], issuesWithoutDueDates: [] } as {issuesWithDueDates: IssueData[], issuesWithoutDueDates: IssueData[]})
    // .filter((issue) => issue.due_date.length > 0)
    // .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
  // console.log(`RoadmapList issuesWithDueDates: `, issuesWithDueDates);
  // console.log(`RoadmapList issuesWithoutDueDates: `, issuesWithoutDueDates);
  const sortedIssuesWithDueDates = flattenedIssues.sort(sortMilestones)
  console.log(`RoadmapList sortedIssuesWithDueDates: `, sortedIssuesWithDueDates);

  /**
   * Group by the selected option
   */
  const grouped = groupBy === 'none' ? sortedIssuesWithDueDates : sortedIssuesWithDueDates.reduce((acc, issue) => {
    if (groupBy === 'parent') {
      if (acc[issue.parent.html_url]) {
        acc[issue.parent.html_url].push(issue)
      } else {
        acc[issue.parent.html_url] = [issue]
      }
    } else if (groupBy === 'month') {
      const month = issue.due_date ? dayjs(issue.due_date).format('MMM YYYY') : 'Unknown'
      acc[month] = acc[month] ?? []
      acc[month] = acc[month].concat(issue).sort(sortMilestones)
    }
    return acc
  }, {} as { [key: string]: ImmutableObject<IssueData>[] })
  console.log(`RoadmapList grouped: `, grouped);
  // const issuesWithoutDueDate = flattenedIssues.filter((issue) => issue.due_date.length === 0)
  return (
    <>
    <Divider pb="3" />

    <RadioGroup onChange={setGroupBy} value={groupBy}>
      <Stack direction='row'>
        <Text>Group By:</Text>
        <Radio value='directChildren'>Current Children</Radio>
        <Radio value='parent'>Parent/Child</Radio>
        <Radio value='month'>Month</Radio>
        <Radio value='none'>None (flat)</Radio>
      </Stack>
    </RadioGroup>
    <Divider pb="3" />
    <div className={styles.roadmapList}>
      {/* <h1>{rootIssueTitle}</h1> */}
      <h2>{rootIssueDescription}</h2>
      {sortedIssuesWithDueDates.map((issue, index) => (
        <RoadmapListItem key={index} issue={issue} index={index} issues={sortedIssuesWithDueDates} />
      ))}
    </div>
    </>
  )
}
