// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';
import { parseIssue } from '../../lib/parseIssue';

const octokit = new Octokit({ auth: process.env.PLN_ADMIN_GITHUB_TOKEN });
// const referenceIssueData = {
//   owner: 'pln-roadmap',
//   repo: 'roadmap-test',
//   issue_number: 2,
// };

const getIssue = async ({ owner, repo, issue_number }) => {
  if (!owner || !repo || !issue_number) return;
  const { data } = await octokit.rest.issues.get({
    mediaType: {
      format: 'html',
    },
    owner,
    repo,
    issue_number,
  });

  return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`API hit: github-issue`, req.query);
  const { url }: any = req.query;
  const urlSplit = url.split('/');
  // console.log('urlSplit ->', urlSplit);
  // const [, owner, repo, issues, issue_number] = urlSplit;
  const issueInfoFromUrl = { owner: urlSplit[1], repo: urlSplit[2], issue_number: Number(urlSplit[4]) };
  const issue =
    !!issueInfoFromUrl.owner &&
    !!issueInfoFromUrl.repo &&
    !!issueInfoFromUrl.issue_number &&
    (await getIssue(issueInfoFromUrl));
  // console.log('issue ->', issue);
  if (!!issue) {
    res.status(200).json({ issue: issue.url, parsedInfo: parseIssue(issue.body_html) });
  } else {
    res.status(200).json({ message: 'not found' });
  }
}
