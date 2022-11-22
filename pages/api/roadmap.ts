import { checkForLabel } from '../../lib/backend/checkForLabel';
import { errorManager } from '../../lib/backend/errorManager';
import { getChildren } from '../../lib/parser';
import { getIssue } from '../../lib/backend/issue';
import {
  GithubIssueDataWithGroupAndChildren,
  IssueData,
  RoadmapApiResponse,
  RoadmapApiResponseFailure,
  RoadmapApiResponseSuccess
  } from '../../lib/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { resolveChildrenWithDepth } from '../../lib/backend/resolveChildrenWithDepth';
import { addToChildren } from '../../lib/backend/addToChildren';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RoadmapApiResponse>
): Promise<void> {
  console.log(`API hit: roadmap`, req.query);
  const { platform = 'github', owner, repo, issue_number } = req.query;
  const options = Object.create({});
  options.depth = Number(req.query.depth);
  // Set filter_group to a specific word to only return children under the specified word heading.
  options.filter_group = req.query.filter_group || 'children';

  if (!platform || !owner || !repo || !issue_number) {
    res.status(400).json({
      errors: errorManager.flushErrors(),
      error: { code: '400', message: 'URL query is missing fields' }
    } as RoadmapApiResponseFailure);
    return;
  }

  try {
    const rootIssue = await getIssue({ owner, repo, issue_number });
    checkForLabel(rootIssue);

    const childrenFromBodyHtml = (!!rootIssue && rootIssue.body_html && getChildren(rootIssue.body_html)) || null;
    let children: Awaited<ReturnType<typeof resolveChildrenWithDepth>> = [];
    try {
      if (childrenFromBodyHtml != null) {
        children = await resolveChildrenWithDepth(childrenFromBodyHtml)
        if (children.length === 0) {
          throw new Error('No children found, is this a root issue?');
        }
      }
    } catch (err: any) {
      console.error(err);
      if (rootIssue != null) {
        errorManager.addError({
          issue: rootIssue,
          userGuideSection: '#children',
          errorTitle: 'Error resolving children',
          errorMessage: err.message,
        });
      }
    }

    const toReturn: GithubIssueDataWithGroupAndChildren = {
      ...rootIssue,
      root_issue: true,
      group: 'root',
      children
    };

    const data = {
      ...addToChildren([toReturn], {} as IssueData)[0],
      parent: {},
    };

    res.status(200).json({
      errors: errorManager.flushErrors(),
      data,
      pendingChildren: children.flatMap((child) => child.pendingChildren),
    } as RoadmapApiResponseSuccess);
  } catch (err) {
    const message = (err as Error)?.message ?? err;
    res.status(404).json({
      errors: errorManager.flushErrors(),
      error: { code: '404', message: `An Unknown error has occurred and was not captured by the errorManager: ${message}` }
    } as RoadmapApiResponseFailure);
  }
}
