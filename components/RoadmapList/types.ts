import { ImmutableObject } from '@hookstate/core';
import { IssueData } from '../../lib/types';

export interface ListIssueViewModel extends Pick<ImmutableObject<IssueData>, 'html_url' | 'title' | 'completion_rate' | 'due_date' | 'description' | 'children' | 'parent'> {
  isNested: boolean;
}
