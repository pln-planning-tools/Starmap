import React from 'react';

import RoadmapListItemDefault from './RoadmapListItemDefault';

/**
 * This component chooses which of the RoadmapListItem* components to render
 */
// eslint-disable-next-line import/no-unused-modules
export default function RoadmapListItem({ issue, index, issuesWithDueDates }: {issue: IssueData, index: number, issuesWithDueDates: IssueData[]}) {
  return (
    <RoadmapListItemDefault issue={issue} index={index} issuesWithDueDates={issuesWithDueDates} />
  )

}
