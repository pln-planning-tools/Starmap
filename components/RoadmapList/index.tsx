import React, { useState } from 'react';
import { Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';

import { IssueDataViewInput } from '../../lib/types';
import RoadmapListItemDefault from './RoadmapListItemDefault';
import { ListIssueViewModel } from './types';
import styles from './RoadmapList.module.css';

interface RoadmapListProps extends IssueDataViewInput {
  maybe?: unknown
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

export default function RoadmapList({ issueDataState }: RoadmapListProps): JSX.Element {
  const [groupBy, setGroupBy] = useState('directChildren')

  const [isDevMode_groupBy, _setIsDevMode_groupBy] = useState(false);
  const [isDevMode_duplicateDates, _setIsDevMode_duplicateDates] = useState(true);
  const [dupeDateToggleValue, setDupeDateToggleValue] = useState('show');
  const flattenedIssues = issueDataState.children.flatMap((issueData) => issueData.get({ noproxy: true }))
  const datesSeen = new Set<string>();
  const sortedIssuesWithDueDates = flattenedIssues.sort(sortMilestones)
    .map((issue) => {
      const issueViewModel: ListIssueViewModel = {
        ...issue,
        isNested: false
      }
      if (datesSeen.has(issue.due_date) && dupeDateToggleValue === 'hide') {
        issueViewModel.isNested = true
      } else {
        datesSeen.add(issue.due_date)
      }
      return issueViewModel
    })

  /**
   * Group by the selected option
   */
  // const grouped = groupBy === 'none' ? sortedIssuesWithDueDates : sortedIssuesWithDueDates.reduce((acc, issue) => {
  //   if (groupBy === 'parent') {
  //     if (acc[issue.parent.html_url]) {
  //       acc[issue.parent.html_url].push(issue)
  //     } else {
  //       acc[issue.parent.html_url] = [issue]
  //     }
  //   } else if (groupBy === 'month') {
  //     const month = issue.due_date ? dayjs(issue.due_date).format('MMM YYYY') : 'Unknown'
  //     acc[month] = acc[month] ?? []
  //     acc[month] = acc[month].concat(issue).sort(sortMilestones)
  //   }

  //   return acc
  // }, {} as { [key: string]: ImmutableObject<ListIssueViewModel | IssueData>[] })
  let groupByToggle: JSX.Element | null = null
  if (isDevMode_groupBy) {
    groupByToggle = (
      <RadioGroup onChange={setGroupBy} value={groupBy}>
        <Stack direction='row'>
          <Text>Group By:</Text>
          <Radio value='directChildren'>Current Children</Radio>
          <Radio value='parent'>Parent/Child</Radio>
          <Radio value='month'>Month</Radio>
          <Radio value='none'>None (flat)</Radio>
        </Stack>
      </RadioGroup>
    )
  }

  let dupeDateToggle: JSX.Element | null = null
  if (isDevMode_duplicateDates) {
    dupeDateToggle = (
      <RadioGroup onChange={setDupeDateToggleValue} value={dupeDateToggleValue}>
        <Stack direction='row'>
          <Text>Duplicate Dates:</Text>
          <Radio value='hide'>Hide</Radio>
          <Radio value='show'>Show</Radio>
        </Stack>
      </RadioGroup>
    )
  }

  return (
    <>
    {groupByToggle}
    {dupeDateToggle}
    <div className={styles.roadmapList}>
      {sortedIssuesWithDueDates.map((issue, index) => (
        <RoadmapListItemDefault key={index} issue={issue} index={index} issues={sortedIssuesWithDueDates} />
      ))}
    </div>
    </>
  )
}
