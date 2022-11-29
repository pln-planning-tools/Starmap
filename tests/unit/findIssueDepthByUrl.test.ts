import { findIssueDepthByUrl } from '../../lib/findIssueDepthByUrl';
import { testIssueData } from '../fixtures/findIssueDepthByUrl.issueData';

describe('findIssueDepthByUrl', function() {
  const tests: Record<string, number> = {
    'root': 0,
    'childA': 1,
    'childB': 1,
    'childA-1': 2,
    'childB-1-a': 3,
    'no-match': -1
  };
  Object.entries(tests).forEach(([test, expectedDepth]) => {
    it(`returns the correct depth for ${test} issue`, () => {
      const actualDepth = findIssueDepthByUrl(testIssueData, test);
      expect(actualDepth).toEqual(expectedDepth);
    });
  });
})
