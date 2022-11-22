import { GithubIssueDataWithGroup, ParserGetChildrenResponse } from '../types';
import { convertParsedChildToGroupedIssueData } from './convertParsedChildToGroupedIssueData';
import { errorManager } from './errorManager';

export async function resolveChildren (children: ParserGetChildrenResponse[]): Promise<GithubIssueDataWithGroup[]> {
  if (!Array.isArray(children)) {
    throw new Error('Children is not an array. Is this a root issue?');
  }

  try {
    const validChildren: Promise<GithubIssueDataWithGroup>[] = []

    for (const child of children) {
      try {
        validChildren.push(convertParsedChildToGroupedIssueData(child))
      } catch (err) {
        errorManager.addError({
          issue: {
            html_url: child.html_url,
            title: child.html_url,
          },
          errorTitle: 'Error parsing issue',
          errorMessage: (err as Error).message,
          userGuideSection: '#children'
        })
      }
    }

    return Promise.all(validChildren);
  } catch (reason) {
    throw new Error(`Error resolving children: ${reason}`);
  }
};
