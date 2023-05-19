import { paramsFromUrl } from '../paramsFromUrl'
import { GithubIssueDataWithGroup, ParserGetChildrenResponse } from '../types'
import { getIssue } from './issue'

export async function convertParsedChildToGroupedIssueData (child: ParserGetChildrenResponse): Promise<GithubIssueDataWithGroup> {
  const urlParams = paramsFromUrl(child.html_url)
  const issueData = await getIssue(urlParams)

  return {
    ...issueData,
    labels: issueData?.labels ?? [],
    group: child.group
  }
}
