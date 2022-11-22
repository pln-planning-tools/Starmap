import { calculateCompletionRate } from '../../../lib/backend/calculateCompletionRate'
import { IssueStates } from '../../../lib/enums';

describe('calculateCompletionRate', function() {
  it('converts a closed issue to 100', () => {
    expect(calculateCompletionRate({children: [], state: IssueStates.CLOSED})).toEqual(100);
  })
  it('converts an open issue without valid children to 0', () => {
    expect(calculateCompletionRate({children: null as unknown as {state: IssueStates}[], state: IssueStates.OPEN})).toEqual(0);
  })

  it('converts an open issue with 1 closed child to 50', () => {
    expect(calculateCompletionRate({children: [{state: IssueStates.CLOSED}], state: IssueStates.OPEN})).toEqual(50);
  })
  it('converts an open issue with 1 closed child to 50', () => {
    expect(calculateCompletionRate({children: [{state: IssueStates.CLOSED}], state: IssueStates.OPEN})).toEqual(50);
  })
})
