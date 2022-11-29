import { IssueStates } from '../enums';

export interface CalculateCompletionRateOptions {
  state: IssueStates;
  children: { state: IssueStates, children: CalculateCompletionRateOptions[] }[];
}

interface GetIssueCountsResponse {
  open: number;
  closed: number;
  total: number;
  percentClosed: number;
}

/**
 * recursively count the total, open, and closed issues, and return an object that includes the percent closed
 * @param {CalculateCompletionRateOptions} issue
 * @returns
 */
export function getIssueCounts(issue: CalculateCompletionRateOptions): GetIssueCountsResponse {
  let open = issue.state === IssueStates.OPEN ? 1 : 0;
  let closed = issue.state === IssueStates.CLOSED ? 1 : 0;
  let total = 1;
  if ((issue.children?.length ?? 0) !== 0) {

    const withChildren = issue.children.reduce(({open: accOpen, closed: accClosed, total: accTotal}, child) => {
      const { open: childrenOpen, closed: childrenClosed, total: childrenTotal } = getIssueCounts(child);
      const total = accTotal + childrenTotal;
      const open = accOpen + childrenOpen;
      const closed = accClosed + childrenClosed;
      return {
        total,
        open,
        closed,
      };
    }, {open, closed, total});
    open = withChildren.open;
    closed = withChildren.closed;
    total = withChildren.total;
  }


  return {
    total,
    open,
    closed,
    percentClosed: Number(Number((closed / total) * 100 || 0).toFixed(2)),
  };

}

export function calculateCompletionRate ({ children, state }: CalculateCompletionRateOptions): number {
  return getIssueCounts({ children, state }).percentClosed;
};
