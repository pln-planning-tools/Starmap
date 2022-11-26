import { IssueData } from './types';

export function addChildToParentIssue(rootIssueData: IssueData, childIssueData: IssueData, parentHtmlUrl: string) {
  if (rootIssueData.html_url === parentHtmlUrl) {
    rootIssueData.children.push(childIssueData);
    return rootIssueData;
  }

  // else
  for (const rootChild of rootIssueData.children) {
    const result = addChildToParentIssue(rootChild, childIssueData, parentHtmlUrl)
    if (result) {
      return result;
    }
  }
}
