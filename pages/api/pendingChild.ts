import type { NextApiRequest, NextApiResponse } from 'next';
import { addToChildren } from '../../lib/backend/addToChildren';

import { checkForLabel } from '../../lib/backend/checkForLabel';
import { convertParsedChildToGroupedIssueData } from '../../lib/backend/convertParsedChildToGroupedIssueData';
import { getGithubIssueDataWithGroupAndChildren } from '../../lib/backend/getGithubIssueDataWithGroupAndChildren';
import { getIssue } from '../../lib/backend/issue';
import { GithubIssueDataWithGroup, GithubIssueDataWithGroupAndChildren } from '../../lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GithubIssueDataWithGroupAndChildren | {error: Error}>
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).send({ error: new Error('Only POST requests allowed') })
    return
  }
  console.log(`req.body: `, );
  // console.log(`API hit: pendingChild`, req.query);
  const { owner, repo, issue_number, parent } = req.body;
  // const githubIssue = await getIssue({ owner, repo, issue_number })
  // checkForLabel(githubIssue);

  console.log('trying to get data for child')
  try {

    const issueDataWithGroup: GithubIssueDataWithGroup = await convertParsedChildToGroupedIssueData({
      html_url: `https://github.com/${owner}/${repo}/issues/${issue_number}`,
      group: '',
    })
    try {
      const issueDataWithGroupAndChildren = await getGithubIssueDataWithGroupAndChildren(issueDataWithGroup, false)
      const issueData = addToChildren([issueDataWithGroupAndChildren], parent)

      res.status(200).json({
        ...issueData[0],
      });
    } catch (err) {
      res.status(501).json({
        error: err as Error
      })
    }
  } catch (err) {
    res.status(502).json({
      error: err as Error
    })
  }

}
