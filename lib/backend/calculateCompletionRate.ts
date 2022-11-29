import { IssueStates } from '../enums';

export interface CalculateCompletionRateOptions {
  state: IssueStates;
  children: { state: IssueStates, children: CalculateCompletionRateOptions[] }[];
}

export function calculateCompletionRate ({ children, state }: CalculateCompletionRateOptions): number {
  children = Array.isArray(children) ? children : [];
  /**
   * The total count is all children plus the parent.
   */
  const total = children.length + 1;
  let open = 0;
  let closed = 0;
  children.concat([{ state, children: [] }]).forEach(({state}) => {
     if (state === IssueStates.OPEN) {
      open++;
     } else if (state === IssueStates.CLOSED) {
      closed++;
     }
  });
  const completionRate = Number((closed / total) * 100 || 0).toFixed(2);

  return Number(completionRate);
};
