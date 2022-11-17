import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  GithubIssueDataWithGroup,
  GithubIssueDataWithGroupAndChildren,
  IssueData,
  ParserGetChildrenResponse,
  RoadmapApiResponse,
  RoadmapApiResponseFailure,
  RoadmapApiResponseSuccess
} from '../../lib/types';

import { getIssue } from '../../lib/backend/issue';
import { getChildren, getConfig } from '../../lib/parser';
import { paramsFromUrl } from '../../lib/paramsFromUrl';
import { errorManager } from '../../lib/backend/errorManager';
import { checkForLabel } from '../../lib/backend/checkForLabel';

async function resolveChildren (children: ParserGetChildrenResponse[]): Promise<GithubIssueDataWithGroup[]> {
  if (!Array.isArray(children)) {
    throw new Error('Children is not an array. Is this a root issue?');
  }

  if (children.length === 0) {
    throw new Error('Children array is empty. Is this a root issue?');
  }

  return Promise.all(children.map(async (child): Promise<GithubIssueDataWithGroup> => {
    const urlParams = paramsFromUrl(child.html_url);
    if (!urlParams) {
      throw new Error('Could not parse URL');
    }
    const issueData = await getIssue(urlParams);
    checkForLabel(issueData);
    return {
      ...issueData,
      labels: issueData?.labels ?? [],
      group: child.group
    };
  }));
};

async function resolveChildrenWithDepth(children: ParserGetChildrenResponse[]): Promise<GithubIssueDataWithGroupAndChildren[]> {
  try {
    const issues = await resolveChildren(children);
    return await Promise.all(issues.map(async (issueData): Promise<GithubIssueDataWithGroupAndChildren> => {
      const childrenParsed = getChildren(issueData.body_html);
      return {
        ...issueData,
        labels: issueData.labels ?? [],
        children: (childrenParsed.length > 0 && (await resolveChildren(childrenParsed))) || childrenParsed,
      }
    }));
  } catch (err) {
    console.error('error:', err);
    return [];
  }
};

function calculateCompletionRate ({ children, state }): number {
  if (state === 'closed') return 100;
  if (!Array.isArray(children)) return 0;
  const issueStats = Object.create({});
  issueStats.total = children.length;
  issueStats.open = children.filter(({state}) => state === 'open').length;
  issueStats.closed = children.filter(({state}) => state === 'closed').length;
  issueStats.completionRate = Number(Number(issueStats.closed / issueStats.total) * 100 || 0).toFixed(2);

  return issueStats.completionRate;
};

function addToChildren(
  data: GithubIssueDataWithGroupAndChildren[] | ParserGetChildrenResponse[],
  parent: IssueData
): IssueData[] {
  if (Array.isArray(data) && data.length > 0) {
    return data.map((item): IssueData => ({
      labels: item.labels ?? [],
      completion_rate: calculateCompletionRate(item),
      due_date: getConfig(item).eta,
      html_url: item.html_url,
      group: item.group,
      title: item.title,
      state: item.state,
      node_id: item.node_id,
      body: item.body,
      body_html: item.body_html,
      body_text: item.body_text,
      parent,
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
      }
    } catch (err) {
      console.error(err);
      if (rootIssue != null) {
        errorManager.addError({
          issueUrl: rootIssue.html_url,
          issueTitle: rootIssue.title,
          message: err as string,
          title: 'Error resolving children',
          userGuideUrl: 'https://github.com/pln-planning-tools/Starmaps/blob/main/User%20Guide.md#children'
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
