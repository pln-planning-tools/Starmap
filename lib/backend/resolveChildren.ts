import { GithubIssueDataWithGroup, ParserGetChildrenResponse } from '../types';
import { convertParsedChildToGroupedIssueData } from './convertParsedChildToGroupedIssueData';
import { ErrorManager } from './errorManager';

export async function resolveChildren (children: ParserGetChildrenResponse[], errorManager: ErrorManager): Promise<GithubIssueDataWithGroup[]> {
  if (!Array.isArray(children)) {
    throw new Error('Children is not an array. Is this a root issue?');
  }
  try {
    return await Promise.all(children.map(
      async (child: ParserGetChildrenResponse): Promise<GithubIssueDataWithGroup> => {
        try {
          return await convertParsedChildToGroupedIssueData(child, errorManager);
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
          throw err;
        }
      }
    ));
  } catch (reason) {
    throw new Error(`Error resolving children: ${reason}`);
  }
};
