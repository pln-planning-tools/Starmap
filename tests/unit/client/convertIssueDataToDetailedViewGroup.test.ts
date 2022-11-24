import { convertIssueDataToDetailedViewGroup } from '../../../lib/client/convertIssueDataToDetailedViewGroup';
import { IssueStates } from '../../../lib/enums';
import { DetailedViewGroup, IssueData } from '../../../lib/types';

const getFakeIssue = (partialIssueData?: Partial<IssueData>) => ({
  title: 'fake issue for testing',
  state: IssueStates.CLOSED,
  children: [],
  completion_rate: 0,
  due_date: '2022-01-01',
  // parent: ,
  group: 'none',
  body_html: 'fake body_html',
  body_text: 'fake body_text',
  body: 'fake body',
  html_url: 'fake html_url',
  labels: [],
  node_id: 'blank',
  ...partialIssueData,
});

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
          actual = convertIssueDataToDetailedViewGroup(issueData);
        })
        it(`group names match`, () => {
          expect(actual.map((i) => i.groupName)).toEqual(issuesGrouped.map((i) => i.groupName));
        });
        it(`group urls match`, () => {
          expect(actual.map((i) => i.url)).toEqual(issuesGrouped.map((i) => i.url));
        });
        it(`group items match`, () => {
          expect(actual.map((i) => i.items.map(i => i.html_url))).toEqual(issuesGrouped.map((i) => i.items.map(i => i.html_url)));
        });
      });
    });
  });
});
