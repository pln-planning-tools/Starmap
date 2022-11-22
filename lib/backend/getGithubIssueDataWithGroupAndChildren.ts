import { getChildren } from '../parser';
import { GithubIssueDataWithGroup, GithubIssueDataWithGroupAndChildren } from '../types';
import { resolveChildren } from './resolveChildren';
import { resolveChildrenWithDepth } from './resolveChildrenWithDepth';

export async function getGithubIssueDataWithGroupAndChildren (issueData: GithubIssueDataWithGroup, usePendingChildren = true): Promise<GithubIssueDataWithGroupAndChildren> {
  const childrenParsed = getChildren(issueData.body_html);

  return {
    ...issueData,
    labels: issueData.labels ?? [],
    children: usePendingChildren ? [] : await resolveChildrenWithDepth(await resolveChildren(childrenParsed)),
    pendingChildren: usePendingChildren ? childrenParsed : undefined
  }
}
