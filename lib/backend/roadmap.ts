import { addToChildren } from '../../lib/backend/addToChildren';
import { ErrorManager } from '../../lib/backend/errorManager';
import { getIssue } from '../../lib/backend/issue';
import { resolveChildrenWithDepth } from '../../lib/backend/resolveChildrenWithDepth';
import { getChildren } from '../../lib/parser';
import { RoadmapApiResponse, RoadmapApiResponseFailure, RoadmapApiResponseSuccess } from '../../lib/types';

export default async function getRoadmap({
  platform = 'github',
  owner,
  repo,
  issue_number,
  depth = 1,
  filter_group = 'children',
}): Promise<RoadmapApiResponse> {
  const params = { platform, owner, repo, issue_number, depth, filter_group };
  const options = Object.create({});
  options.depth = Number(params.depth);
  // Set filter_group to a specific word to only return children under the specified word heading.
  options.filter_group = params.filter_group || 'children';
  console.log(`backend hit: roadmap`, params);

  const errorManager = new ErrorManager();
  if (!platform || !owner || !repo || !issue_number) {
    console.log('getRoadmap function is missing required parameters.');
    return {
      errors: errorManager.flushErrors(),
      error: { code: '400', message: 'URL query is missing fields' },
    } as RoadmapApiResponseFailure;
    // return;
  }

  try {
    const rootIssue = await getIssue({ owner, repo, issue_number });

    const childrenFromBodyHtml = (!!rootIssue && rootIssue.body_html && getChildren(rootIssue.body_html)) || null;
    let children: Awaited<ReturnType<typeof resolveChildrenWithDepth>> = [];
    try {
      if (childrenFromBodyHtml != null) {
        children = await resolveChildrenWithDepth(childrenFromBodyHtml, errorManager);
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

    const issueData = addToChildren(
      [
        {
          ...rootIssue,
          root_issue: true,
          group: 'root',
          children,
        },
      ],
      undefined,
      errorManager,
    )[0];

    return {
      errors: errorManager.flushErrors(),
      data: issueData,
      pendingChildren: children.flatMap((child) => child.pendingChildren),
    } as RoadmapApiResponseSuccess;
  } catch (err) {
    const message = (err as Error)?.message ?? err;
    return {
      errors: errorManager.flushErrors(),
      error: {
        code: '404',
        message: `An Unknown error has occurred and was not captured by the errorManager: ${message}`,
      },
    } as RoadmapApiResponseFailure;
  }
}
