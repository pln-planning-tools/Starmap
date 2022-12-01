/**
 * @jest-environment jsdom
 */
import { convertCrumbDataArraysToCrumbDataString, getCrumbDataArrayFromIssueData, getCrumbDataFromCrumbString, getCrumbStringFromIssueData } from '../../lib/breadcrumbs';
import { ViewMode } from '../../lib/enums';
import { IssueData } from '../../lib/types';

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
    const expectedCrumbs = convertCrumbDataArraysToCrumbDataString(parents.map(getCrumbDataArrayFromIssueData));
    url.searchParams.append('crumbs', expectedCrumbs);
  }
  return url.toString();
}

describe('getCrumbDataFromCrumbString', function () {

  it('works with 1 crumb', () => {
    const crumbDataArray = getCrumbDataArrayFromIssueData(testData[0]);
    const crumbsString = convertCrumbDataArraysToCrumbDataString([crumbDataArray]);
    expect(getCrumbDataFromCrumbString(crumbsString, ViewMode.Detail)).toEqual([
      {
        url: getExpectedUrlForTestData(testData[0]),
        title: testData[0].title,
      },
    ]);
  });

  it('works with 2 crumbs', () => {
    const crumbsString = convertCrumbDataArraysToCrumbDataString([
      getCrumbDataArrayFromIssueData(testData[0]),
      getCrumbDataArrayFromIssueData(testData[1]),
    ]);
    expect(getCrumbDataFromCrumbString(crumbsString, ViewMode.Detail)).toEqual([
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
    const crumbsString = convertCrumbDataArraysToCrumbDataString([
      getCrumbDataArrayFromIssueData(testData[0]),
      getCrumbDataArrayFromIssueData(testData[1]),
      getCrumbDataArrayFromIssueData(testData[2]),
    ]);

    expect(getCrumbDataFromCrumbString(crumbsString, ViewMode.Detail)).toEqual([
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
    const crumbsString = convertCrumbDataArraysToCrumbDataString([
      getCrumbDataArrayFromIssueData(testData[0]),
      getCrumbDataArrayFromIssueData(testData[1]),
      getCrumbDataArrayFromIssueData(testData[2]),
      getCrumbDataArrayFromIssueData(testData[3]),
    ]);
    expect(getCrumbDataFromCrumbString(crumbsString, ViewMode.Detail)).toEqual([
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
