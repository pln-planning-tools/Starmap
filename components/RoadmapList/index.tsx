import { Radio, RadioGroup, Stack, Text } from '@chakra-ui/react'
import React, { ReactElement, useContext, useState } from 'react'

import { getTimeFromDateString } from '../../lib/helpers'
import { IssueDataStateContext } from '../roadmap/contexts'
import styles from './RoadmapList.module.css'
import RoadmapListItemDefault from './RoadmapListItemDefault'

/**
 * Sorts milestones by due date, in ascending order (2022-01-01 before 2023-01-01) with invalid dates at the end.
 * @param {ListIssueViewModel | IssueData} a
 * @param {ListIssueViewModel | IssueData} b
 * @returns
 */
function sortMilestones (a, b) {
  // Get either a unix timestamp or Number.MAX_VALUE
  const aTime = getTimeFromDateString(a.due_date, Number.MAX_VALUE)
  const bTime = getTimeFromDateString(b.due_date, Number.MAX_VALUE)

  // if a is valid and b is not, MAX_VALUE - validTime will be positive.
  // if b is valid and a is not, MAX_VALUE - validTime will be negative.
  // if both are valid, or invalid, result is 0.
  return aTime - bTime
}

export default function RoadmapList (): ReactElement | null {
  const [groupBy, setGroupBy] = useState('directChildren')
  const issueDataState = useContext(IssueDataStateContext)

  // eslint-disable-next-line no-unused-vars
  const [isDevModeGroupBy, _setIsDevModeGroupBy] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [isDevModeDuplicateDates, _setIsDevModeDuplicateDates] = useState(false)
  const [dupeDateToggleValue, setDupeDateToggleValue] = useState('show')
  if (issueDataState.ornull === null) {
    return null
  }
  const flattenedIssues = issueDataState.ornull.children.flatMap((issueData) => issueData.get({ noproxy: true }))
  const sortedIssuesWithDueDates = flattenedIssues.sort(sortMilestones)

  let groupByToggle: ReactElement | null = null
  if (isDevModeGroupBy) {
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

  let dupeDateToggle: ReactElement | null = null
  if (isDevModeDuplicateDates) {
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
