import { paramsFromUrl } from '../paramsFromUrl';
import { GithubIssueDataWithGroup, ParserGetChildrenResponse } from '../types';
import { checkForLabel } from './checkForLabel';
import { ErrorManager } from './errorManager';
import { getIssue } from './issue';

export async function convertParsedChildToGroupedIssueData(child: ParserGetChildrenResponse, errorManager: ErrorManager): Promise<GithubIssueDataWithGroup> {
  const urlParams = paramsFromUrl(child.html_url);
  const issueData = await getIssue(urlParams);
  checkForLabel(issueData, errorManager);

  return {
    ...issueData,
    labels: issueData?.labels ?? [],
    group: child.group
  };
}
