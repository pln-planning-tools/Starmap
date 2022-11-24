import { IssueStates } from '../enums';
import { GithubIssueData } from '../types';
import { getOctokit } from './octokit';

export async function getIssue ({ owner, repo, issue_number }): Promise<GithubIssueData> {
  try {
    const { data } = await getOctokit().rest.issues.get({
      mediaType: {
        format: 'full',
      },
      owner,
      repo,
      issue_number,
    });

    return {
      html_url: data.html_url,
      title: data.title,
      state: IssueStates[data.state],
      node_id: data.node_id,
      body_html: data.body_html || '',
      labels: data.labels
        .map((label) => (typeof label !== 'string' ? label.name : label)) as string[],
    };
  } catch (err) {
    console.error('error:', err);
    throw new Error(`Error getting issue: ${err}`);
  }
};
