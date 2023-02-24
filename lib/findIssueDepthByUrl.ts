import { ImmutableObject } from '@hookstate/core';
import { IssueData } from './types';

export function findIssueDepthByUrl(rootIssueData: ImmutableObject<IssueData>, parentHtmlUrl: string, depth = 0): number {
  if (rootIssueData.html_url === parentHtmlUrl) {
    return depth;
  }

  const foundIssueDepth = -1
  for (const issueData of rootIssueData.children) {
    const foundDepth = findIssueDepthByUrl(issueData, parentHtmlUrl, depth + 1);
    if (foundDepth !== -1) {
      return foundDepth
    }
  };

  return foundIssueDepth;
}
