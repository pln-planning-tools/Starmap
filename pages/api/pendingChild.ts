import type { NextApiRequest, NextApiResponse } from 'next';

import { checkForLabel } from '../../lib/backend/checkForLabel';
import { convertParsedChildToGroupedIssueData } from '../../lib/backend/convertParsedChildToGroupedIssueData';
import { getGithubIssueDataWithGroupAndChildren } from '../../lib/backend/getGithubIssueDataWithGroupAndChildren';
import { getIssue } from '../../lib/backend/issue';
import { GithubIssueDataWithGroupAndChildren } from '../../lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GithubIssueDataWithGroupAndChildren>
): Promise<void> {
  console.log(`API hit: pendingChild`, req.query);
    const { owner, repo, issue_number, group } = req.query;
    const githubIssue = await getIssue({ owner, repo, issue_number })
    checkForLabel(githubIssue);
    const data = await convertParsedChildToGroupedIssueData({
      html_url: `https://github.com/${owner}/${repo}/issues/${issue_number}`,
      group: group as string,
    })
    const moreData = await getGithubIssueDataWithGroupAndChildren(data, false)
    console.log(`data: `, data);

  res.status(200).json({
    ...moreData
  });

}
