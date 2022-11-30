/**
 * @jest-environment jsdom
 */
import { getCrumbDataFromCrumbString, getCrumbStringFromIssueData } from '../../../lib/breadcrumbs';
import { ViewMode } from '../../../lib/enums';
import { IssueData } from '../../../lib/types';

const testData: (Pick<IssueData, 'html_url' | 'title' | 'children'>)[] = [
  {
    html_url: 'https://github.com/ipfs/ipfs-gui/issues/106',
    title: 'IPFS Ignite Roadmap - 2022->2023',
    children: [],
  },
  {
    html_url: 'https://github.com/ipfs/ipfs-gui/issues/124',
    title: 'Theme: UX & UI Improvements',
    children: [],
  },
  {
    html_url: 'https://github.com/ipfs/ipfs-gui/issues/110',
    title: 'Public Gateway Checker reskin',
    children: [],
  },
  {
    html_url: 'https://github.com/ipfs/public-gateway-checker/issues/93',
    title: 'Improve Public Gateway Checker',
    children: [],
  },
];

const getExpectedUrlForTestData = (testIssue: typeof testData[number], parents: typeof testData[number][] = [], viewMode = ViewMode.Detail) => {
  const url = new URL(`http://localhost/roadmap/${testIssue.html_url.replace('https://', '')}#${viewMode}`)
  if (parents.length > 0) {
    const expectedCrumbs = parents.map(getCrumbStringFromIssueData).join(',');
    url.searchParams.append('crumbs', expectedCrumbs);
  }
  return url.toString();
}

describe('getCrumbDataFromCrumbString', function () {

  it('works with 1 crumb', () => {
    expect(getCrumbDataFromCrumbString(getCrumbStringFromIssueData(testData[0] as IssueData), ViewMode.Detail)).toEqual([
      {
        url: getExpectedUrlForTestData(testData[0]),
        title: testData[0].title,
      },
    ]);
  });

  it('works with 2 crumbs', () => {
    expect(getCrumbDataFromCrumbString((testData.slice(0,2) as IssueData[]).map(getCrumbStringFromIssueData).join(','), ViewMode.Detail)).toEqual([
      {
        url: getExpectedUrlForTestData(testData[0]),
        title: testData[0].title,
      },
      {
        url: getExpectedUrlForTestData(testData[1], [testData[0]]),
        title: testData[1].title,
      },
    ]);
  });

  it('works with 3 crumbs', () => {
    expect(getCrumbDataFromCrumbString((testData.slice(0,3) as IssueData[]).map(getCrumbStringFromIssueData).join(','), ViewMode.Detail)).toEqual([
      {
        url: getExpectedUrlForTestData(testData[0]),
        title: testData[0].title,
      },
      {
        url: getExpectedUrlForTestData(testData[1], [testData[0]]),
        title: testData[1].title,
      },
      {
        url: getExpectedUrlForTestData(testData[2], [testData[0], testData[1]]),
        title: testData[2].title,
      },
    ]);
  });

  it('works with 4 crumbs', () => {
    expect(getCrumbDataFromCrumbString((testData.slice(0,4) as IssueData[]).map(getCrumbStringFromIssueData).join(','), ViewMode.Detail)).toEqual([
      {
        url: getExpectedUrlForTestData(testData[0]),
        title: testData[0].title,
      },
      {
        url: getExpectedUrlForTestData(testData[1], [testData[0]]),
        title: testData[1].title,
      },
      {
        url: getExpectedUrlForTestData(testData[2], [testData[0], testData[1]]),
        title: testData[2].title,
      },
      {
        url: getExpectedUrlForTestData(testData[3], [testData[0], testData[1], testData[2]]),
        title: testData[3].title,
      },
    ]);
  });
});
