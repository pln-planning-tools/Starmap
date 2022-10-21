import type { RestEndpointMethodTypes } from '@octokit/rest';
import _ from 'lodash';

import { getConfig } from '../parser';
import { GithubIssueApiResponse, IssueData } from '../types';
import { octokit } from './octokit';

type GithubIssueResponse = RestEndpointMethodTypes["issues"]["get"]["response"]
type GithubIssueResponseData = GithubIssueResponse['data'];

const filterDefaultFields = (obj: GithubIssueResponseData) =>
  _.pick(obj, ['html_url', 'title', 'state', 'node_id', 'body', 'body_html', 'body_text', 'children']);
const metadataFromIssue = (issue: GithubIssueResponseData) => ({ dueDate: getConfig(issue?.body_html)?.eta });

const metadataFromBackend = (issue) => ({ completion_rate: 30 });

interface IssueWithExtras extends GithubIssueResponseData {
  dueDate: string;
  completion_rate: number;
}
const getIssue = async ({ platform, owner, repo, issue_number }): Promise<IssueWithExtras> => {
  console.log('getIssue:', { owner, repo, issue_number });
  try {
    const { data } = await octokit.rest.issues.get({
      mediaType: {
        format: 'full',
      },
      owner,
      repo,
      issue_number,
    });

    const issuesWithExtras: IssueWithExtras = {
      ...metadataFromIssue(data),
      ...metadataFromBackend(data),
      ...filterDefaultFields(data),
    };
    return issuesWithExtras;
  } catch (err) {
    console.error('error:', err);
    throw err
    // return { issueData: null, error: err as Error}
  }
};

// const getChildrenDepth = async (issueArray, depth = 0) => {
//   if (depth <= 2) {
//     depth = depth + 1;
//   }
// };

const getIssueWithDepth = async (issueArray, depth = 0) => {
  // console.log('issueArray:', issueArray);
  console.log('depth:', depth);

  issueArray.reduce(async (a, b) => {
    const issue = await getIssue(b);
    return [...a, issue];
  });

  console.log('issueArray:', issueArray);

  return await getIssue(issueArray);
};

export { getIssue, filterDefaultFields, metadataFromIssue, metadataFromBackend, getIssueWithDepth };
