import type { NextApiRequest, NextApiResponse } from 'next';

import _ from 'lodash';

import { getIssue } from '../../lib/backend/issue';
import { getChildren, getConfig } from '../../lib/parser';
import { IssueData, ParserGetChildrenResponse, RoadmapApiQueryParameters, RoadmapApiResponse } from '../../lib/types';
import { paramsFromUrl } from '../../utils/general';

const resolveChildren = (children: ParserGetChildrenResponse[]): Promise<IssueData[]> => {
  const resultArray: any = [];
  let count = 0;

  return new Promise((resolve, reject) => {
    if (!_.isArray(children)) reject('resolveChildren(children): `children` is not an array.');
    if (_.isArray(children) && children.length === 0)
      reject('resolveChildren(children): `children` is an empty array.');

    children.forEach((current) => {
      const params = paramsFromUrl(current.html_url) as RoadmapApiQueryParameters;
      const { platform, owner, repo, issue_number } = params;
      getIssue({ platform, owner, repo, issue_number }).then((issueData) => {
        resultArray.push({ ...issueData, group: current.group });
        count += 1;
        if (count === children.length) {
          resolve(resultArray);
          return;
        }
      });
    });
  });
};

// Resolve children from root issue recursively calling resolveChildren for each.
const resolveChildrenWithDepth = async (children: ParserGetChildrenResponse[]): Promise<IssueData | undefined> => {
  if (_.isEmpty(children)) {
    return;
  }
  return resolveChildren(children).then((issues) => {
    const resultArray: any = [];
    let count = 0;

    return new Promise<IssueData>((resolve) => {
      issues.forEach(async (issueData) => {
        const childrenParsed = getChildren(issueData.body_html);
        resultArray.push({
          ...issueData,
          children: (childrenParsed.length > 0 && (await resolveChildren(childrenParsed))) || childrenParsed,
        });
        count += 1;
        if (count === children.length) {
          resolve(resultArray);
        }
      });
    }).then((data) => {
      return data;
    });
  });
};

const addCompletionRate = (data) => {
  if (!_.isArray(data)) return 0;
  const issueStats = Object.create({});
  issueStats.total = data.length;
  issueStats.open = data.filter((v) => v.state == 'open').length;
  issueStats.closed = data.filter((v) => v.state == 'closed').length;
  issueStats.completionRate = Number(Number(issueStats.closed / issueStats.total) * 100 || 0).toFixed(2);

  return issueStats.completionRate;
};

const addDueDates = ({ body_html }) => getConfig(body_html).eta;

const addItemsToChildren = (data, parent) => {
  if (_.isArray(data) && data.length > 0) {
    return data.map((item) => {
      return {
        completion_rate: addCompletionRate(item.children),
        due_date: addDueDates(item),
        html_url: item.html_url,
        group: item.group,
        title: item.title,
        state: item.state,
        node_id: item.node_id,
        body: item.body,
        body_html: item.body_html,
        body_text: item.body_text,
        parent: { html_url: parent.html_url, title: parent.title },
        children: addItemsToChildren(item.children, item),
      };
    });
  }

  return [];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<RoadmapApiResponse>) {
  console.log(`API hit: roadmap`, req.query);
  const { platform = 'github', owner, repo, issue_number } = req.query;
  const reqQueryParams: RoadmapApiQueryParameters = Object.create({
    platform: req.query.platform || 'github',
    owner: req.query.owner,
    repo: req.query.repo,
    issue_number: req.query.issue_number,
  });
  const options = Object.create({});
  options.depth = Number(req.query.depth);
  // Set filter_group to a specific word to only return children under the specified word heading.
  options.filter_group = req.query.filter_group || 'children';

  if (!platform || !owner || !repo || !issue_number) {
    res
      .status(400)
      .json({ error: { code: '400', message: 'Some required fields are missing from the URL query string' } });
    return;
  }
  try {
    const rootIssue = await getIssue(reqQueryParams);
    if (!rootIssue) {
      res.status(500).json({ error: { code: '500', message: 'No issue found.' } });
      return;
    }

    // We should probably check for due dates of milestones instead of the root roadmap
    // if (!getConfig(rootIssue?.body_html)?.eta) {
    //   // res.status(500).json({ error: { code: '500', message: 'No due date found in issue body.' } });
    //   // return;
    // }

    const childrenFromBodyHtml = rootIssue.body_html && getChildren(rootIssue.body_html);
    // console.log('rootIssue:', rootIssue);
    // console.log('childrenFromBodyHtml:', childrenFromBodyHtml);
    const toReturn = {
      ...rootIssue,
      children: (!!childrenFromBodyHtml && (await resolveChildrenWithDepth(childrenFromBodyHtml))) || [],
    };
    const toReturnEnriched = addItemsToChildren([{ children: [toReturn] }], {})[0].children[0];
    const defaultResponse = Object.create({
      parent: {},
      children: [],
    });

    res.status(200).json({ data: { ...defaultResponse, ...toReturnEnriched } });
  } catch (err) {
    console.error('error:', err);

    res.status(500).json({ error: { code: '500', message: 'API error' } });
  }
}
