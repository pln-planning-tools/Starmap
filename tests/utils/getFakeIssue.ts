import { IssueStates } from '../../lib/enums';
import { IssueData } from '../../lib/types';

export const getFakeIssue = (partialIssueData: Partial<IssueData> = {}) => ({
  title: 'fake issue for testing',
  state: IssueStates.CLOSED,
  children: [],
  completion_rate: 0,
  due_date: '2022-01-01',
  group: 'none',
  html_url: 'fake html_url',
  labels: [],
  node_id: 'blank',
  ...partialIssueData,
} as IssueData);


