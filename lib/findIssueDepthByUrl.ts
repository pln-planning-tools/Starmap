import { IssueData } from './types';

export function findIssueDepthByUrl(rootIssueData: IssueData, parentHtmlUrl: string, depth = 0): number {
  if (rootIssueData.html_url === parentHtmlUrl) {
    return depth;
  }

  let foundIssueDepth = -1
  for (const issueData of rootIssueData.children) {
    const foundDepth = findIssueDepthByUrl(issueData, parentHtmlUrl, depth + 1);
    if (foundDepth !== -1) {
      return foundDepth
    }
  };

  return foundIssueDepth;
  // throw new Error(`findIssueDataByUrl: Cannot find issue with url '${parentHtmlUrl}' in rootIssueData`);
}
