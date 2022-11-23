import type { NextApiRequest, NextApiResponse } from 'next';

import { checkForLabel } from '../../lib/backend/checkForLabel';
import { convertParsedChildToGroupedIssueData } from '../../lib/backend/convertParsedChildToGroupedIssueData';
import { getGithubIssueDataWithGroupAndChildren } from '../../lib/backend/getGithubIssueDataWithGroupAndChildren';
import { getIssue } from '../../lib/backend/issue';
import { GithubIssueDataWithGroup, GithubIssueDataWithGroupAndChildren } from '../../lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GithubIssueDataWithGroupAndChildren | {error: Error}>
): Promise<void> {
  console.log(`API hit: pendingChild`, req.query);
  const { owner, repo, issue_number } = req.query;
  // const githubIssue = await getIssue({ owner, repo, issue_number })
  // checkForLabel(githubIssue);

  console.log('trying to get data for child')
  try {

    const data: GithubIssueDataWithGroup = await convertParsedChildToGroupedIssueData({
      html_url: `https://github.com/${owner}/${repo}/issues/${issue_number}`,
      group: '',
    })
    try {
      const moreData = await getGithubIssueDataWithGroupAndChildren(data, false)

      res.status(200).json({
        ...moreData
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
