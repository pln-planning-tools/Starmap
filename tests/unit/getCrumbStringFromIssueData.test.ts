import { getCrumbStringFromIssueData } from '../../lib/breadcrumbs'

describe('getCrumbStringFromIssueData', function() {
  it('works', () => {
    const testData: Parameters<typeof getCrumbStringFromIssueData>[0] = {
      html_url: 'https://github.com/OrgA/RepoA/issues/1',
      title: 'Issue 1',
    }
    expect(getCrumbStringFromIssueData(testData)).toEqual(JSON.stringify(['OrgA/RepoA#1', 'Issue 1']));
  })
})
