import _ from 'lodash';
import { getConfig } from '../parser';
import { octokit } from './octokit';

const filterDefaultFields = (obj) =>
  _.pick(obj, ['html_url', 'title', 'state', 'node_id', 'body', 'body_html', 'body_text', 'children']);
const metadataFromIssue = (issue) => ({ dueDate: getConfig(issue?.body_html)?.eta });

const getIssue = async ({ platform, owner, repo, issue_number }) => {
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

    return { ...metadataFromIssue(data), ...filterDefaultFields(data) };
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

export { getIssue, filterDefaultFields, metadataFromIssue, getIssueWithDepth };
