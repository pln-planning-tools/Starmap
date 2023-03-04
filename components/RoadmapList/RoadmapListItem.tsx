import { ImmutableObject } from '@hookstate/core';
import React from 'react';

import { IssueData } from '../../lib/types';
import RoadmapListItemDefault from './RoadmapListItemDefault';

/**
 * This component chooses which of the RoadmapListItem* components to render
 */
// eslint-disable-next-line import/no-unused-modules
export default function RoadmapListItem({ issue, index, issues }: {issue: ImmutableObject<IssueData>, index: number, issues: ImmutableObject<IssueData>[]}) {

  return (
    <RoadmapListItemDefault issue={issue} index={index} issues={issues} />
  )

}
