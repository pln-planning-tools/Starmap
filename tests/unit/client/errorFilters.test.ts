import { getIssueErrorFilter } from '../../../lib/client/errorFilters';
import { IssueData, StarMapsIssueErrorsGrouped } from '../../../lib/types';
import {testIssueData} from '../../fixtures/findIssueDepthByUrl.issueData';

const flattenIssueData = (issueData: IssueData): IssueData[] => {
  return [
    issueData,
    ...issueData.children.flatMap((i) => flattenIssueData(i)),
  ];
}
const flattenedIssues = flattenIssueData(testIssueData);

describe('errorFilters.ts', function() {
  let errors: StarMapsIssueErrorsGrouped[] = [];
  beforeAll(() => {
    errors = flattenedIssues.map((issue) => ({
      issueUrl: issue.html_url,
      issueTitle: issue.title,
      errors: [],
    }));
  });

  describe('getIssueErrorFilter', function() {
    it('Can filter out all but the root issue', () => {
      const errFilterFn = getIssueErrorFilter(0);
      const actual = errFilterFn(errors, testIssueData);
      expect(actual).toHaveLength(1);
      expect(actual[0].issueUrl).toEqual('root');
    });

    it('Can filter out the root issue and direct children only', () => {
      const errFilterFn = getIssueErrorFilter(1);
      const actual = errFilterFn(errors, testIssueData);
      expect(actual).toHaveLength(3);
      expect(actual[0].issueUrl).toEqual('root');
      expect(actual[1].issueUrl).toEqual('childA');
      expect(actual[2].issueUrl).toEqual('childB');
    });

    it('Can filter out the root issue and grandchildren 2 levels deep', () => {
      const errFilterFn = getIssueErrorFilter(2);
      const actual = errFilterFn(errors, testIssueData);
      expect(actual).toHaveLength(5);
      expect(actual[0].issueUrl).toEqual('root');
      expect(actual[1].issueUrl).toEqual('childA');
      expect(actual[2].issueUrl).toEqual('childA-1');
      expect(actual[3].issueUrl).toEqual('childB');
      expect(actual[4].issueUrl).toEqual('childB-1');
    });

    it('Can filter out the root issue and grandchildren 3 levels deep', () => {
      const errFilterFn = getIssueErrorFilter(3);
      const actual = errFilterFn(errors, testIssueData);
      expect(actual).toHaveLength(7);
      expect(actual[0].issueUrl).toEqual('root');
      expect(actual[1].issueUrl).toEqual('childA');
      expect(actual[2].issueUrl).toEqual('childA-1');
      expect(actual[3].issueUrl).toEqual('childA-1-a');
      expect(actual[4].issueUrl).toEqual('childB');
      expect(actual[5].issueUrl).toEqual('childB-1');
      expect(actual[6].issueUrl).toEqual('childB-1-a');
    });

  });
});
