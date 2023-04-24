import type { NextApiRequest, NextApiResponse } from 'next';
import { addToChildren } from '../../lib/backend/addToChildren';

import { convertParsedChildToGroupedIssueData } from '../../lib/backend/convertParsedChildToGroupedIssueData';
import { ErrorManager } from '../../lib/backend/errorManager';
import { getGithubIssueDataWithGroupAndChildren } from '../../lib/backend/getGithubIssueDataWithGroupAndChildren';
import { checkForSavedIssueData, saveIssueDataToFile } from '../../lib/backend/saveIssueDataToFile';
import { GithubIssueDataWithGroup, PendingChildApiResponse } from '../../lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PendingChildApiResponse>
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).send({ error: { ...new Error('Only GET requests allowed'), code: '405' } })
    return
  }
  const { owner, repo, issue_number, parentJson } = req.query;
  const parentJsonDecoded = decodeURIComponent(parentJson as string);
  const parent = JSON.parse(parentJsonDecoded);
  const errorManager = new ErrorManager();

  if (process.env.IS_LOCAL === 'true') {
    try {
      const issueData = await checkForSavedIssueData({ owner, repo, issue_number });
      console.log(`Returning saved issueData for ${owner}/${repo}#${issue_number}`);
      res.status(200).json({ data: issueData, errors: [] });
      return;
    } catch {
      console.log(`NOT_FOUND: saved issueData for ${owner}/${repo}#${issue_number}`);
    }
  }

  try {
    const issueDataWithGroup: GithubIssueDataWithGroup = await convertParsedChildToGroupedIssueData({
      html_url: `https://github.com/${owner}/${repo}/issues/${issue_number}`,
      group: '',
    })
    try {
      const issueDataWithGroupAndChildren = await getGithubIssueDataWithGroupAndChildren(issueDataWithGroup, errorManager, false)
      const issueData = addToChildren([issueDataWithGroupAndChildren], parent, errorManager)[0]

      if (process.env.IS_LOCAL === 'true') {
        saveIssueDataToFile(issueData);
      }

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
