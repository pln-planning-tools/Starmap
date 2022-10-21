import { octokit } from './octokit';

const getIssue = async ({ platform, owner, repo, issue_number }) => {
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

export { getIssue };
