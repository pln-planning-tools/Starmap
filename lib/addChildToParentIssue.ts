import { IssueData } from './types';


export function addChildToParentIssue(rootIssueData: IssueData, childIssueData: IssueData, parentHtmlUrl: string) {
  if (rootIssueData.html_url === parentHtmlUrl) {
    // console.log(`adding child to issue: ${rootIssueData.html_url} -> ${childIssueData.html_url}`)
    rootIssueData.children.push(childIssueData);
    return rootIssueData;
  } else {
    for (const rootChild of rootIssueData.children) {
      // console.log(`rootChild: `, rootChild);
      const result = addChildToParentIssue(rootChild, childIssueData, parentHtmlUrl)
      if (result) {
        return result;
      }
    }
  }
}
