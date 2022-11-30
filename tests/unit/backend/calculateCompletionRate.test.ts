import { calculateCompletionRate, CalculateCompletionRateOptions } from '../../../lib/backend/calculateCompletionRate'
import { IssueStates } from '../../../lib/enums';
import { IssueData } from '../../../lib/types';

const closed = IssueStates.CLOSED;
const open = IssueStates.OPEN;

describe('calculateCompletionRate', function() {
  let testObject: CalculateCompletionRateOptions;
  beforeEach(() => {
    testObject = {
      state: open,
      html_url: 'root',
      children: [
        {
          state: open,
          html_url: 'childB',
          children: [
            {
              state: open,
              html_url: 'childB-1',
              children: [
                {
                  state: open,
                  html_url: 'childB-1-a',
                  children: [] as IssueData[],
                },
                {
                  state: open,
                  html_url: 'childB-1-b',
                  children: [] as IssueData[],
                },
                {
                  state: open,
                  html_url: 'childB-1-c',
                  children: [] as IssueData[],
                },
                {
                  state: open,
                  html_url: 'childB-1-d',
                  children: [] as IssueData[],
                },
                {
                  state: open,
                  html_url: 'childB-1-e',
                  children: [] as IssueData[],
                }
              ],
            },
          ],
        },
        {
          state: open,
          html_url: 'childB', // purposefully a duplicate
          children: [] as IssueData[],
        },
      ],
    };
  });

  describe('parent issue closed', () => {
    beforeEach(() => {
      testObject.state = closed;
    });
    it('with no children to 100', () => {
      testObject.children = [];
      expect(calculateCompletionRate(testObject)).toEqual(100);
    });
    it('with 1 open child to 50', () => {
      testObject.children[0].children = [];
      expect(calculateCompletionRate(testObject)).toEqual(50);
    });
    it('with 1 closed child to 100', () => {
      testObject.children[0].children = [];
      testObject.children[0].state = closed;
      expect(calculateCompletionRate(testObject)).toEqual(100);
    });
    it('without valid children to 100', () => {
      expect(calculateCompletionRate({html_url: 'childC', children: null as unknown as CalculateCompletionRateOptions[], state: closed})).toEqual(100);
    });

    describe('multiple children', () => {
      it('with 2 open children to 33.33', () => {
        testObject.children[0].children = [];
        testObject.children.push({...testObject.children[0], html_url: 'childC' });
        expect(calculateCompletionRate(testObject)).toEqual(33.33);
      });
      it('with 1 open child and 1 closed child to 66.67', () => {
        testObject.children[0].children = [];
        testObject.children.push({...testObject.children[0], html_url: 'childC' });
        testObject.children[0].state = closed;
        expect(calculateCompletionRate(testObject)).toEqual(66.67);
      });
      it('with 2 closed children to 100', () => {
        testObject.children[0].children = [];
        testObject.children[0].state = closed;
        testObject.children.push({...testObject.children[0], html_url: 'childC' });
        expect(calculateCompletionRate(testObject)).toEqual(100);
      });
    });

    describe('with grandchildren', () => {
      it('with 0 successful grandchild to 12.5', () => {
        expect(calculateCompletionRate(testObject)).toEqual(12.5);
      });
      it('with 1 successful grandchild to 25', () => {
        testObject.children[0].children[0].children[0].state = closed;
        expect(calculateCompletionRate(testObject)).toEqual(25);
      });

      it('with 2 successful grandchildren to 37.5', () => {
        testObject.children[0].children[0].children[0].state = closed;
        testObject.children[0].children[0].children[1].state = closed;

        expect(calculateCompletionRate(testObject)).toEqual(37.5);
      });

      it('with 3 successful grandchildren to 50', () => {
        testObject.children[0].children[0].children[0].state = closed;
        testObject.children[0].children[0].children[1].state = closed;
        testObject.children[0].children[0].children[2].state = closed;

        expect(calculateCompletionRate(testObject)).toEqual(50);
      });

      it('with 4 successful grandchildren to 62.5', () => {
        testObject.children[0].children[0].children[0].state = closed;
        testObject.children[0].children[0].children[1].state = closed;
        testObject.children[0].children[0].children[2].state = closed;
        testObject.children[0].children[0].children[3].state = closed;

        expect(calculateCompletionRate(testObject)).toEqual(62.5);
      });
    });
  });

  describe('parent issue open', () => {
    it('with no children to 0', () => {
      testObject.children = [];
      expect(calculateCompletionRate(testObject)).toEqual(0);
    });
    it('with 1 open child to 0', () => {
      testObject.children[0].children = [];
      expect(calculateCompletionRate(testObject)).toEqual(0);
    });
    it('with 1 closed child to 50', () => {
      testObject.children[0].children = [];
      testObject.children[0].state = closed;
      expect(calculateCompletionRate(testObject)).toEqual(50);
    });
    it('without valid children to 0', () => {
      expect(calculateCompletionRate({html_url: 'childC', children: null as unknown as CalculateCompletionRateOptions[], state: open})).toEqual(0);
    });

    describe('multiple children', () => {
      it('with 2 open children to 0', () => {
        testObject.children[0].children = [];
        testObject.children.push({...testObject.children[0]});
        expect(calculateCompletionRate(testObject)).toEqual(0);
      });
      it('with 1 open child and 1 closed child to 33.33', () => {
        testObject.children[0].children = [];
        testObject.children.push({...testObject.children[0], html_url: 'childC' });
        testObject.children[0].state = closed;
        expect(calculateCompletionRate(testObject)).toEqual(33.33);
      });
      it('with 2 closed children to 66.67', () => {
        testObject.children[0].children = [];
        testObject.children[0].state = closed;
        testObject.children.push({...testObject.children[0], html_url: 'childC' });
        expect(calculateCompletionRate(testObject)).toEqual(66.67);
      });
    });

    describe('with grandchildren', () => {
      it('with 0 successful grandchild to 0', () => {
        expect(calculateCompletionRate(testObject)).toEqual(0);
      });
      it('with 1 successful grandchild to 12.5', () => {
        testObject.children[0].children[0].children[0].state = closed;
        expect(calculateCompletionRate(testObject)).toEqual(12.5);
      });

      it('with 2 successful grandchildren to 25', () => {
        testObject.children[0].children[0].children[0].state = closed;
        testObject.children[0].children[0].children[1].state = closed;

        expect(calculateCompletionRate(testObject)).toEqual(25);
      });

      it('with 3 successful grandchildren to 37.5', () => {
        testObject.children[0].children[0].children[0].state = closed;
        testObject.children[0].children[0].children[1].state = closed;
        testObject.children[0].children[0].children[2].state = closed;

        expect(calculateCompletionRate(testObject)).toEqual(37.5);
      });

      it('with 4 successful grandchildren to 50', () => {
        testObject.children[0].children[0].children[0].state = closed;
        testObject.children[0].children[0].children[1].state = closed;
        testObject.children[0].children[0].children[2].state = closed;
        testObject.children[0].children[0].children[3].state = closed;

        expect(calculateCompletionRate(testObject)).toEqual(50);
      });

      it('with 4 successful duplicated grandchildren to 50', () => {
        testObject.children[0].children[0].children[0].state = closed;
        testObject.children[0].children[0].children[1].state = closed;
        testObject.children[0].children[0].children[2].state = closed;
        testObject.children[0].children[0].children[3].state = closed;
        testObject.children.push(...testObject.children[0].children[0].children);

        expect(calculateCompletionRate(testObject)).toEqual(50);
      });
    });

  });
});
