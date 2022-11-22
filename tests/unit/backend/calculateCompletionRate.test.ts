import { calculateCompletionRate } from '../../../lib/backend/calculateCompletionRate'
import { IssueStates } from '../../../lib/enums';

describe('calculateCompletionRate', function() {

  describe('parent issue closed', () => {
    it('with no children to 100', () => {
      expect(calculateCompletionRate({children: [], state: IssueStates.CLOSED})).toEqual(100);
    });
    it('with 1 open child to 50', () => {
      expect(calculateCompletionRate({children: [{state: IssueStates.OPEN}], state: IssueStates.CLOSED})).toEqual(50);
    });
    it('with 1 closed child to 100', () => {
      expect(calculateCompletionRate({children: [{state: IssueStates.CLOSED}], state: IssueStates.CLOSED})).toEqual(100);
    });
    it('without valid children to 0', () => {
      expect(calculateCompletionRate({children: null as unknown as {state: IssueStates}[], state: IssueStates.CLOSED})).toEqual(100);
    });

    describe('multiple children', () => {
      it('with 2 open children', () => {
        expect(calculateCompletionRate({children: [{state: IssueStates.OPEN}, {state: IssueStates.OPEN}], state: IssueStates.CLOSED})).toEqual(33.33);
      });
      it('with 1 open child and 1 closed child', () => {
        expect(calculateCompletionRate({children: [{state: IssueStates.OPEN}, {state: IssueStates.CLOSED}], state: IssueStates.CLOSED})).toEqual(66.67);
      });
      it('with 2 closed children', () => {
        expect(calculateCompletionRate({children: [{state: IssueStates.CLOSED}, {state: IssueStates.CLOSED}], state: IssueStates.CLOSED})).toEqual(100);
      });
    });
  });

  describe('parent issue open', () => {
    it('with no children to 0', () => {
      expect(calculateCompletionRate({children: [], state: IssueStates.OPEN})).toEqual(0);
    });
    it('with 1 open child to 50', () => {
      expect(calculateCompletionRate({children: [{state: IssueStates.OPEN}], state: IssueStates.OPEN})).toEqual(0);
    });
    it('with 1 closed child to 50', () => {
      expect(calculateCompletionRate({children: [{state: IssueStates.CLOSED}], state: IssueStates.OPEN})).toEqual(50);
    });
    it('without valid children to 0', () => {
      expect(calculateCompletionRate({children: null as unknown as {state: IssueStates}[], state: IssueStates.OPEN})).toEqual(0);
    });

    describe('multiple children', () => {
      it('with 2 open children', () => {
        expect(calculateCompletionRate({children: [{state: IssueStates.OPEN}, {state: IssueStates.OPEN}], state: IssueStates.OPEN})).toEqual(0);
      });
      it('with 1 open child and 1 closed child', () => {
        expect(calculateCompletionRate({children: [{state: IssueStates.OPEN}, {state: IssueStates.CLOSED}], state: IssueStates.OPEN})).toEqual(33.33);
      });
      it('with 2 closed children', () => {
        expect(calculateCompletionRate({children: [{state: IssueStates.CLOSED}, {state: IssueStates.CLOSED}], state: IssueStates.OPEN})).toEqual(66.67);
      });
    });
  })
})
