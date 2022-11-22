import { checkForLabel } from '../../lib/backend/checkForLabel';
import { errorManager } from '../../lib/backend/errorManager';
import { getChildren, getDueDate } from '../../lib/parser';
import { getIssue } from '../../lib/backend/issue';
import {
  GithubIssueDataWithGroup,
  GithubIssueDataWithGroupAndChildren,
  IssueData,
  ParserGetChildrenResponse,
  RoadmapApiResponse,
  RoadmapApiResponseFailure,
  RoadmapApiResponseSuccess
  } from '../../lib/types';
import { IssueStates } from '../../lib/enums';
import { paramsFromUrl } from '../../lib/paramsFromUrl';
import type { NextApiRequest, NextApiResponse } from 'next';

async function resolveChildren (children: ParserGetChildrenResponse[]): Promise<GithubIssueDataWithGroup[]> {
  if (!Array.isArray(children)) {
    throw new Error('Children is not an array. Is this a root issue?');
  }

  return Promise.all(children.map(async (child): Promise<GithubIssueDataWithGroup> => {
    try {
      const urlParams = paramsFromUrl(child.html_url);
      const issueData = await getIssue(urlParams);
      checkForLabel(issueData);
      return {
        ...issueData,
        labels: issueData?.labels ?? [],
        group: child.group
      };
    } catch (err) {
      errorManager.addError({
        issue: {
          html_url: child.html_url,
          title: child.html_url,
        },
        errorTitle: 'Error parsing issue',
        errorMessage: (err as Error).message,
        userGuideSection: '#children'
      })
      throw new Error(`Error parsing issue: ${err}`);
    }
  })).catch((reason) => {
    throw new Error(`Error resolving children: ${reason}`);
  });
};

async function resolveChildrenWithDepth(children: ParserGetChildrenResponse[]): Promise<GithubIssueDataWithGroupAndChildren[]> {
  try {
    const issues = await resolveChildren(children);
    return await Promise.all(issues.map(async (issueData): Promise<GithubIssueDataWithGroupAndChildren> => {
      const childrenParsed = getChildren(issueData.body_html);
      const childrenResolved = await resolveChildren(childrenParsed);

      return {
        ...issueData,
        labels: issueData.labels ?? [],
        children: await resolveChildrenWithDepth(childrenResolved),
      }
    }));
  } catch (err) {
    console.error('error:', err);
    return [];
  }
};

function calculateCompletionRate ({ children, state }): number {
  if (state === IssueStates.CLOSED) return 100;
  if (!Array.isArray(children)) return 0;
  const issueStats = Object.create({});
  issueStats.total = children.length;
  issueStats.open = children.filter(({state}) => state === IssueStates.OPEN).length;
  issueStats.closed = children.filter(({state}) => state === IssueStates.CLOSED).length;
  issueStats.completionRate = Number(Number(issueStats.closed / issueStats.total) * 100 || 0).toFixed(2);

  return issueStats.completionRate;
};

function addToChildren(
  data: GithubIssueDataWithGroupAndChildren[],
  parent: IssueData | GithubIssueDataWithGroupAndChildren
): IssueData[] {
  if (Array.isArray(data)) {
    return data.map((item: GithubIssueDataWithGroupAndChildren): IssueData => ({
      labels: item.labels ?? [],
      completion_rate: calculateCompletionRate(item),
      due_date: getDueDate(item).eta,
      html_url: item.html_url,
      group: item.group,
      title: item.title,
      state: item.state,
      node_id: item.node_id,
      body: item.body,
      body_html: item.body_html,
      body_text: item.body_text,
      parent: parent as IssueData,
      children: addToChildren(item.children, item),
    }));
  }

  return [];
};

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
    } as RoadmapApiResponseSuccess);
  } catch (err) {
    const message = (err as Error)?.message ?? err;
    res.status(404).json({
      errors: errorManager.flushErrors(),
      error: { code: '404', message: `An Unknown error has occurred and was not captured by the errorManager: ${message}` }
    } as RoadmapApiResponseFailure);
  }
}
