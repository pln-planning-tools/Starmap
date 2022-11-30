import { IssueStates } from '../enums';
import { IssueData } from '../types';

export type CalculateCompletionRateOptions = Pick<IssueData, 'html_url' | 'state'> & { children: CalculateCompletionRateOptions[] };

interface GetIssueCountsResponse {
  open: number;
  closed: number;
  total: number;
  percentClosed: number;
}

const issueKey = ({ html_url }: Pick<IssueData, 'html_url'>) => html_url;

function getIssueStatesMap(issue: CalculateCompletionRateOptions, issueStatesMap = new Map<string, IssueStates>()): Map<string, IssueStates> {
  const key = issueKey(issue);
  if (issueStatesMap.has(key)) {
    return issueStatesMap;
  }
  issueStatesMap.set(key, issue.state);
  issue.children?.map((child) => getIssueStatesMap(child, issueStatesMap));

  return issueStatesMap;
}

function getIssueCounts(issueStatesMap: Map<string, IssueStates>): GetIssueCountsResponse {
  const total = issueStatesMap.size;
  let open = 0;
  let closed = 0;
  issueStatesMap.forEach((value) => {
    if (value === IssueStates.OPEN) {
      open++;
    } else {
      closed++;
    }
  });

  return {
    total,
    open,
    closed,
    percentClosed: Number(Number((closed / total) * 100 || 0).toFixed(2)),
  };
}

export function calculateCompletionRate (issue: CalculateCompletionRateOptions): number {
  const issueStatesMap = getIssueStatesMap(issue);
  const { percentClosed } = getIssueCounts(issueStatesMap);
  return percentClosed;
};
