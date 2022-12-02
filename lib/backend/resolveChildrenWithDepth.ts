import { GithubIssueDataWithGroupAndChildren, ParserGetChildrenResponse } from '../types';
import { ErrorManager } from './errorManager';
import { getGithubIssueDataWithGroupAndChildren } from './getGithubIssueDataWithGroupAndChildren';
import { resolveChildren } from './resolveChildren';

export async function resolveChildrenWithDepth(children: ParserGetChildrenResponse[], errorManager: ErrorManager): Promise<GithubIssueDataWithGroupAndChildren[]> {
  try {
    const issues = await resolveChildren(children, errorManager);
    return await Promise.all(issues.map((issue) => getGithubIssueDataWithGroupAndChildren(issue, errorManager, true)));
  } catch (err) {
    console.error('error:', err);
    return [];
  }
};
