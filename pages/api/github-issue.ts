// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';
import { parseIssue } from '../../lib/parseIssue';
import { getGraph } from '../../lib/graph';

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

const infoFromUrl = (url) => {
  console.log('infoFromUrl | url ->', url);
  const urlSplit = new URL(url).pathname.split('/');
  return { owner: urlSplit[1], repo: urlSplit[2], issue_number: Number(urlSplit[4]) };
};

const withChildren = async (issueResponse) => {
  // const depthResponse = await Promise.all(
  //   issueResponse.parsed.lists[0]?.references.map((reference) => getIssue(infoFromUrl(reference))),
  // );
  const depthResponse = (
    await Promise.allSettled(
      issueResponse.parsed.lists?.map(async (list) => ({
        title: list.title || '',
        references: (
          await Promise.allSettled(list.references.map((reference) => getIssue(infoFromUrl(reference))))
        ).map((v) => v.status == 'fulfilled' && v.value),
      })),
    )
  ).map((v) => v.status == 'fulfilled' && v.value);
  // console.dir(depthResponse);
  const issueChildren = depthResponse?.map((v) => {
    // const parsedChildIssue = parseIssue(v?.body_html);
    return {
      url: v.html_url,
      title: v.title || '',
      node_id: v.node_id,
      state: v.state,
      parsed: parseIssue(v.body_html),
      children: v.references.map((v) => ({
        title: v.title || '',
        node_id: v.node_id,
        state: v.state,
        parsed: parseIssue(v.body_html),
      })),
    };
  });

  return {
    ...issueResponse,
    children: issueChildren,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`API hit: github-issue`, req.query);
  const { url }: any = req.query;
  const depth = Number(req.query?.depth);
  const { owner, repo, issue_number } = infoFromUrl(url);
  // const [, owner, repo, issues, issue_number] = urlSplit;
  if (!!owner && !!repo && !!issue_number) {
    const issue = await getIssue({ owner, repo, issue_number });
    // console.log('issue ->', issue);
    const parsedIssue = parseIssue(issue?.body_html);
    const issueResponse = {
      url: issue?.html_url,
      title: issue?.title,
      node_id: issue?.node_id,
      state: issue?.state,
      parsed: parsedIssue,
      children: {},
    };

    // if (depth === 1) {
    //   const depthResponse = await Promise.all(
    //     parsedIssue.lists[0]?.references.map((reference) => getIssue(infoFromUrl(reference))),
    //   );
    //   // console.dir(depthResponse);
    //   issueResponse.children = depthResponse.map(async (v) => {
    //     // const parsedChildIssue = parseIssue(v?.body_html);
    //     return {
    //       url: v?.html_url,
    //       title: v?.title,
    //       node_id: v?.node_id,
    //       state: v?.state,
    //       parsed: parseIssue(v?.body_html),
    //     };
    //   });
    // }

    res
      .status(200)
      .json(
        (depth === 1 && issueResponse.parsed.lists.length > 0 && (await withChildren(issueResponse))) || issueResponse,
      );
  } else {
    res.status(200).json({ message: 'not found' });
  }
}
