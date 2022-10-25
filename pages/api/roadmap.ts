import type { NextApiRequest, NextApiResponse } from 'next';

import _, { result } from 'lodash';

import { getIssue } from '../../lib/backend/issue';
import { getChildren, getConfig } from '../../lib/parser';
import { IssueData, ParserGetChildrenResponse, RoadmapApiResponse } from '../../lib/types';
import { paramsFromUrl } from '../../utils/general';

const resolveChildren = (children: any[]): Promise<IssueData[]> => {
  const resultArray: any = [];
  let count = 0;

  return new Promise((resolve, reject) => {
    if (!_.isArray(children)) reject('not array');
    if (_.isArray(children) && children.length === 0) reject('empty array');

    children.forEach((current) => {
      getIssue({ ...paramsFromUrl(current.html_url) }).then((issueData) => {
        resultArray.push({ ...issueData, group: current.group });
        count += 1;
        if (count === children.length) {
          resolve(resultArray);
        }
      });
    });
  });
};

const resolveChildrenWithDepth = async (children: ParserGetChildrenResponse[]) => {
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

const addToChildren = (data, parent) => {
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
        children: addToChildren(item.children, item),
      };
    });
  }

  return [];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<RoadmapApiResponse>) {
  console.log(`API hit: roadmap`, req.query);
  const { platform = 'github', owner, repo, issue_number } = req.query;
  const options = Object.create({});
  options.depth = Number(req.query.depth);
  // Set filter_group to a specific word to only return children under the specified word heading.
  options.filter_group = req.query.filter_group || 'children';

  if (!platform || !owner || !repo || !issue_number) {
    res.status(400).json({ error: { code: '400', message: 'URL query is missing fields' } });
    return;
  }
  try {
    const rootIssue = await getIssue({ platform, owner, repo, issue_number });
    // console.log('rootIssue:', rootIssue);
    // We should probably check for children due dates instead of the root issue
    // if (!getConfig(rootIssue?.body_html)?.eta) {
    //   // res.status(500).json({ error: { code: '500', message: 'No due date found in issue body.' } });
    //   // return;
    // }

    const childrenFromBodyHtml = (!!rootIssue && rootIssue.body_html && getChildren(rootIssue.body_html)) || null;
    const toReturn = {
      ...rootIssue,
      children: (!!childrenFromBodyHtml && (await resolveChildrenWithDepth(childrenFromBodyHtml))) || [],
    };

    res.status(200).json({ data: { ...addToChildren([{ children: [toReturn] }], {})[0].children[0], parent: {} } });
  } catch (err) {
    console.error('error:', err);
    res.status(404).json({ error: { code: '404', message: 'not found' } });
  }
}
