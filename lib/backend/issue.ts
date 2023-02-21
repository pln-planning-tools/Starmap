import { IssueStates } from '../enums';
import { GithubIssueData } from '../types';
import { getOctokit } from './octokit';

const cache = new Map<string, GithubIssueData>();

export async function getIssue ({ owner, repo, issue_number }): Promise<GithubIssueData> {
  const cacheKey = `${owner}${repo}${issue_number}`;
  if (process.env.IS_LOCAL === 'true') {
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey) as GithubIssueData;
    }
  }
  try {
    const { data } = await getOctokit().rest.issues.get({
      mediaType: {
        format: 'full',
      },
      owner,
      repo,
      issue_number,
    });

    const result: GithubIssueData = {
      html_url: data.html_url,
      title: data.title,
      state: data.state as IssueStates,
      node_id: data.node_id,
      body_html: data.body_html || '',
      body: data.body || '',
      labels: data.labels
        .map((label) => (typeof label !== 'string' ? label.name : label)) as string[],
    };

    if (process.env.IS_LOCAL === 'true') {
      cache.set(cacheKey, result)
    }
    return result;
  } catch (err) {
    console.error('error:', err);
    throw new Error(`Error getting issue: ${err}`);
  }
};
