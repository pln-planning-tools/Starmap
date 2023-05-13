import { ImmutableObject } from '@hookstate/core'

import { IssueData } from '../../lib/types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ListIssueViewModel extends Pick<ImmutableObject<IssueData>, 'html_url' | 'title' | 'completion_rate' | 'due_date' | 'description' | 'children' | 'parent'> {

}
