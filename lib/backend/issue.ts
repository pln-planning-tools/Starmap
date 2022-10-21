import _ from 'lodash';
import { getConfig } from '../parser';
import { octokit } from './octokit';

const getIssue = async ({ platform, owner, repo, issue_number }) => {
  // console.log('getIssue:', { owner, repo, issue_number });
  try {
    const { data } = await octokit.rest.issues.get({
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
      state: data.state,
      node_id: data.node_id,
      body: data.body,
      body_html: data.body_html,
      body_text: data.body_text,
    };
  } catch (err) {
    console.error('error:', err);
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

export { getIssue, getIssueWithDepth };
