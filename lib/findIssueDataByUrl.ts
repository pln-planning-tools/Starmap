import { IssueData } from './types'

export function findIssueDataByUrl (rootIssueData: IssueData, parentHtmlUrl: string): IssueData | undefined {
  if (rootIssueData.html_url === parentHtmlUrl) {
    return rootIssueData
  } else {
    let foundIssueData: IssueData | undefined = rootIssueData.children.find((issueData) => {
      foundIssueData = findIssueDataByUrl(issueData, parentHtmlUrl)
      return !!foundIssueData
    })

    return foundIssueData
  }

  // throw new Error(`findIssueDataByUrl: Cannot find issue with url '${parentHtmlUrl}' in rootIssueData`);
}
