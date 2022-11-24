import { getChildren } from '../parser';
import { GithubIssueDataWithGroup, GithubIssueDataWithGroupAndChildren, ParserGetChildrenResponse } from '../types';
import { resolveChildren } from './resolveChildren';
import { resolveChildrenWithDepth } from './resolveChildrenWithDepth';

export async function getGithubIssueDataWithGroupAndChildren (issueData: GithubIssueDataWithGroup, usePendingChildren = true): Promise<GithubIssueDataWithGroupAndChildren> {
  const childrenParsed: ParserGetChildrenResponse[] = getChildren(issueData.body_html);

  const ghIssueDataWithGroupAndChildren: GithubIssueDataWithGroupAndChildren = {
    ...issueData,
    labels: issueData.labels ?? [],
    children: usePendingChildren ? [] : await resolveChildrenWithDepth(await resolveChildren(childrenParsed)),
    pendingChildren: usePendingChildren ? childrenParsed : undefined
  };

  return ghIssueDataWithGroupAndChildren;
}
