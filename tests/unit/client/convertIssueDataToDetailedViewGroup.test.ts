/**
 * @jest-environment jsdom
 */
import { hookstate } from '@hookstate/core';
import { convertIssueDataToDetailedViewGroup, convertIssueDataStateToDetailedViewGroupOld } from '../../../lib/client/convertIssueDataToDetailedViewGroup';
import { IssueStates, ViewMode } from '../../../lib/enums';
import { DetailedViewGroup, IssueData } from '../../../lib/types';

const getFakeIssue = (partialIssueData?: Partial<IssueData>) => ({
  title: 'fake issue for testing',
  state: IssueStates.CLOSED,
  children: [],
  completion_rate: 0,
  due_date: '2022-01-01',
  // parent: ,
  group: 'none',
  html_url: 'fake html_url',
  labels: [],
  node_id: 'blank',
  ...partialIssueData,
} as IssueData);

describe('convertIssueDataToDetailedViewGroup', function() {
  it('converts an issue with no children an empty array', () => {
    const fakeIssue = getFakeIssue();
    const actual = convertIssueDataToDetailedViewGroup(fakeIssue);
    expect(actual).toBeInstanceOf(Array);
    expect(actual).toHaveLength(0);
  });
  it('converts an issue with one child to an empty array', () => {
    const fakeIssueChild = getFakeIssue({ title: 'fake issue child' });
    const fakeIssueParent = getFakeIssue({ title: 'fake issue parent', children: [fakeIssueChild] });
    fakeIssueChild.parent = fakeIssueParent;
    const actual = convertIssueDataToDetailedViewGroup(fakeIssueParent);
    expect(actual).toBeInstanceOf(Array);
    expect(actual).toHaveLength(0);
  });

  describe('roadmap fixtures', () => {
    ['ipfs-roadmap-102', 'filecoin-project-bacalhau-1151'].map((roadmapName) => {
      describe(`correctly converts ${roadmapName}`, () => {
        let issueData: IssueData;
        let issuesGrouped: DetailedViewGroup[];
        let actual: DetailedViewGroup[]
        beforeAll(async () => {
          issueData = (await import(`../../fixtures/issueData/${roadmapName}.json`)).default as unknown as IssueData;
          issuesGrouped = (await import(`../../fixtures/issuesGrouped/${roadmapName}.json`)).default as unknown as DetailedViewGroup[];
          actual = convertIssueDataStateToDetailedViewGroupOld(hookstate(issueData), ViewMode.Detail, {});
        })
        it(`group names match`, () => {
          expect(actual.map((i) => i.groupName).sort()).toEqual(issuesGrouped.map((i) => i.groupName).sort());
        });
        it(`group urls match`, () => {
          expect(actual.map((i) => i.url).sort()).toEqual(issuesGrouped.map((i) => i.url).sort());
        });
        it(`group items match`, () => {
          expect(actual.map((i) => i.items.map(i => i.html_url)).sort()).toEqual(issuesGrouped.map((i) => i.items.map(i => i.html_url)).sort());
        });
      });
    });
  });
});
