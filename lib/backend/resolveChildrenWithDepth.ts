import { GithubIssueDataWithGroupAndChildren, ParserGetChildrenResponse } from '../types';
import { getGithubIssueDataWithGroupAndChildren } from './getGithubIssueDataWithGroupAndChildren';
import { resolveChildren } from './resolveChildren';

export async function resolveChildrenWithDepth(children: ParserGetChildrenResponse[]): Promise<GithubIssueDataWithGroupAndChildren[]> {
  try {
    const issues = await resolveChildren(children);
    return await Promise.all(issues.map((issue) => getGithubIssueDataWithGroupAndChildren(issue, true)));
  } catch (err) {
    console.error('error:', err);
    return [];
  }
};
