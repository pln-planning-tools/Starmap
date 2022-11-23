import { IssueData } from './types';

export function findIssueDataByUrl(rootIssueData: IssueData, parentHtmlUrl: string): IssueData {
  if (rootIssueData.html_url === parentHtmlUrl) {
    return rootIssueData;
  } else {
    for (const rootChild of rootIssueData.children) {
      const result = findIssueDataByUrl(rootChild, parentHtmlUrl)
      if (result) {
        return result;
      }
    }
  }

  throw new Error('Cannot find issue in rootIssueData');
}
