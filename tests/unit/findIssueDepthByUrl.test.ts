import { findIssueDepthByUrl } from '../../lib/findIssueDepthByUrl';
import { testIssueData } from '../fixtures/findIssueDepthByUrl.issueData';

describe('findIssueDepthByUrl', function() {

  it('returns the correct depth for root issue', () => {
    const actual = findIssueDepthByUrl(testIssueData, 'root');
    expect(actual).toEqual(0);
  });

  it('returns the correct depth for child1 issue', () => {
    const actual = findIssueDepthByUrl(testIssueData, 'child1');
    expect(actual).toEqual(1);
  });

  it('returns the correct depth for child2 issue', () => {
    const actual = findIssueDepthByUrl(testIssueData, 'child2');
    expect(actual).toEqual(1);
  });

  it('returns the correct depth for child1-1 issue', () => {
    const actual = findIssueDepthByUrl(testIssueData, 'child1-1');
    expect(actual).toEqual(2);
  });

  it('returns the correct depth for child2-1-1 issue', () => {
    const actual = findIssueDepthByUrl(testIssueData, 'child2-1-1');
    expect(actual).toEqual(3);
  });

  it('returns -1 for urls that arent found', () => {
    const actual = findIssueDepthByUrl(testIssueData, 'no_test_html_matches_me');
    expect(actual).toEqual(-1);
  });
})
