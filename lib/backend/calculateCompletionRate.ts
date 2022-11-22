import { IssueStates } from '../enums';

export function calculateCompletionRate ({ children, state }): number {
  if (state === IssueStates.CLOSED) return 100;
  if (!Array.isArray(children)) return 0;
  const issueStats = Object.create({});
  issueStats.total = children.length;
  issueStats.open = children.filter(({state}) => state === IssueStates.OPEN).length;
  issueStats.closed = children.filter(({state}) => state === IssueStates.CLOSED).length;
  issueStats.completionRate = Number(Number(issueStats.closed / issueStats.total) * 100 || 0).toFixed(2);

  return issueStats.completionRate;
};
