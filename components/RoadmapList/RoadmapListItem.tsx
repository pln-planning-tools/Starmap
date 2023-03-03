import React from 'react';

import { IssueData } from '../../lib/types';
import RoadmapListItemDefault from './RoadmapListItemDefault';

/**
 * This component chooses which of the RoadmapListItem* components to render
 */
// eslint-disable-next-line import/no-unused-modules
export default function RoadmapListItem({ issue, index, issues }: {issue: IssueData, index: number, issues: IssueData[]}) {

  return (
    <RoadmapListItemDefault issue={issue} index={index} issues={issues} />
  )

}
