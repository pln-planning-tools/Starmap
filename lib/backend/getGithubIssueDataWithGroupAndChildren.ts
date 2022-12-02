import { getChildren } from '../parser';
import { GithubIssueDataWithGroup, GithubIssueDataWithGroupAndChildren, ParserGetChildrenResponse, PendingChildren } from '../types';
import { ErrorManager } from './errorManager';
import { resolveChildren } from './resolveChildren';
import { resolveChildrenWithDepth } from './resolveChildrenWithDepth';

export async function getGithubIssueDataWithGroupAndChildren (issueData: GithubIssueDataWithGroup, errorManager: ErrorManager, usePendingChildren = false): Promise<GithubIssueDataWithGroupAndChildren> {
  const childrenParsed: ParserGetChildrenResponse[] = getChildren(issueData.body_html);
  let pendingChildren: PendingChildren[] | undefined = undefined;
  let children: GithubIssueDataWithGroupAndChildren[] = [];

  if (usePendingChildren) {
    pendingChildren = childrenParsed.map(({ html_url }) => ({ html_url, group: issueData.title, parentHtmlUrl: issueData.html_url }))
  } else {
    children = await resolveChildrenWithDepth(await resolveChildren(childrenParsed, errorManager), errorManager)
  }

  const ghIssueDataWithGroupAndChildren: GithubIssueDataWithGroupAndChildren = {
    ...issueData,
    labels: issueData.labels ?? [],
    children,
    pendingChildren,
  }

  return ghIssueDataWithGroupAndChildren;
}
