import type { NextApiRequest, NextApiResponse } from 'next';
import { addToChildren } from '../../lib/backend/addToChildren';

import { checkForLabel } from '../../lib/backend/checkForLabel';
import { convertParsedChildToGroupedIssueData } from '../../lib/backend/convertParsedChildToGroupedIssueData';
import { getGithubIssueDataWithGroupAndChildren } from '../../lib/backend/getGithubIssueDataWithGroupAndChildren';
import { GithubIssueDataWithGroup, IssueData } from '../../lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IssueData | {error: Error}>
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).send({ error: new Error('Only POST requests allowed') })
    return
  }
  const { owner, repo, issue_number, parent } = req.body;

  try {
    const issueDataWithGroup: GithubIssueDataWithGroup = await convertParsedChildToGroupedIssueData({
      html_url: `https://github.com/${owner}/${repo}/issues/${issue_number}`,
      group: '',
    })
    try {
      const issueDataWithGroupAndChildren = await getGithubIssueDataWithGroupAndChildren(issueDataWithGroup, false)
      const issueData = addToChildren([issueDataWithGroupAndChildren], parent)[0]
      checkForLabel(issueData);

      res.status(200).json({
        ...issueData,
      } as IssueData);
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
