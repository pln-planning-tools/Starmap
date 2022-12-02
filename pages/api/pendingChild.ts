import type { NextApiRequest, NextApiResponse } from 'next';
import { addToChildren } from '../../lib/backend/addToChildren';

import { checkForLabel } from '../../lib/backend/checkForLabel';
import { convertParsedChildToGroupedIssueData } from '../../lib/backend/convertParsedChildToGroupedIssueData';
import { ErrorManager } from '../../lib/backend/errorManager';
import { getGithubIssueDataWithGroupAndChildren } from '../../lib/backend/getGithubIssueDataWithGroupAndChildren';
import { GithubIssueDataWithGroup, PendingChildApiResponse } from '../../lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PendingChildApiResponse>
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).send({ error: { ...new Error('Only POST requests allowed'), code: '405' } })
    return
  }
  const { owner, repo, issue_number, parent } = req.body;
  const errorManager = new ErrorManager();

  try {
    const issueDataWithGroup: GithubIssueDataWithGroup = await convertParsedChildToGroupedIssueData({
      html_url: `https://github.com/${owner}/${repo}/issues/${issue_number}`,
      group: '',
    }, errorManager)
    try {
      const issueDataWithGroupAndChildren = await getGithubIssueDataWithGroupAndChildren(issueDataWithGroup, errorManager, false)
      const issueData = addToChildren([issueDataWithGroupAndChildren], parent, errorManager)[0]
      checkForLabel(issueData, errorManager);

      res.status(200).json({
        data: issueData,
        errors: errorManager.flushErrors(),
      } as PendingChildApiResponse);
    } catch (err) {
      res.status(501).json({
        error: { ...err as Error, code: '501' },
      } as PendingChildApiResponse)
    }
  } catch (err) {
    res.status(502).json({
      error: { ...err as Error, code: '501' },
    })
  }

}
