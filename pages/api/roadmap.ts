import type { NextApiRequest, NextApiResponse } from 'next';

import _ from 'lodash';

import { getIssue } from '../../lib/backend/issue';
import { getChildren, getConfig } from '../../lib/parser';
import { getUrlParams } from '../../utils/general';

const resolveChildren = async (children) => {
  // console.log('resolveChildren!');
  const allSettled = await Promise.allSettled(children.map((child) => getIssue({ ...getUrlParams(child.html_url) })));
  return allSettled.map((v) => v.status == 'fulfilled' && v.value);
};

let depth = 0;
const resolveChildrenWithDepth = async (children) =>
  resolveChildren(children).then((data) =>
    Promise.allSettled(
      data.map(async (current) => {
        depth = depth + 1;
        const childrenOfChildren = getChildren(current.body_html);
        // console.log('childrenOfChildren:', childrenOfChildren);
        return {
          ...current,
          children:
            (childrenOfChildren.length > 0 && (await resolveChildren(childrenOfChildren))) || childrenOfChildren,
        };
      }),
    ).then((data) =>
      data
        .map((v) => {
          // console.log('v:', v);
          return v.status == 'fulfilled' && v.value;
        })
        .map((x) => ({ ...x, children: x.children })),
    ),
  );

const addCompletionRate = (data) => {
  // console.log('data:', data);
  const issueStats = Object.create({});
  issueStats.total = data?.length;
  issueStats.open = data?.filter((v) => v.state == 'open')?.length;
  issueStats.closed = data?.filter((v) => v.state == 'closed')?.length;
  issueStats.completionRate = Number(issueStats.closed / issueStats.total) * 100 || 0;
  // console.log('issueStats:', issueStats);

  return issueStats.completionRate;
  // return Number(
  //   Number(response?.children?.filter((v) => v.state == 'open')?.length / response?.children?.length) * 100,
  // );
};

const addDueDates = ({ body_html }) => getConfig(body_html)?.eta;

const addToChildren = (data, parent) => {
  if (_.isArray(data) && data.length > 0) {
    return data.map((item) => {
      // console.log('item.children:', item.children);
      // console.log('rest:', rest);
      return {
        completion_rate: addCompletionRate(item.children),
        due_date: addDueDates(item),
        html_url: item.html_url,
        title: item.title,
        state: item.state,
        node_id: item.node_id,
        body: item.body,
        body_html: item.body_html,
        body_text: item.body_text,
        parent: { html_url: parent.html_url },
        children: addToChildren(item.children, item),
      };
    });
  }

  return [];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`API hit: roadmap`, req.query);
  const { platform = 'github', owner, repo, issue_number } = req.query;
  const options = Object.create({});
  options.depth = Number(req.query?.depth);

  if (!platform || !owner || !repo || !issue_number) {
    res.status(400).json({ message: 'URL query is missing fields' });
  }
  try {
    const rootIssue = await getIssue({ platform, owner, repo, issue_number });
    // We should probably check for children due dates instead of the root issue
    if (!getConfig(rootIssue?.body_html)?.eta) {
      // res.status(500).json({ error: { code: '500', message: 'No due date found in issue body.' } });
      // return;
    }

    const toReturn = {
      // due_date: getConfig(rootIssue?.body_html)?.eta,
      ...rootIssue,
      children: await resolveChildrenWithDepth(getChildren(rootIssue?.body_html)),
    };

    res.status(200).json({ data: { ...addToChildren([{ children: [toReturn] }], {})[0].children[0], parent: {} } });
  } catch (err) {
    console.error('error:', err);
    res.status(404).json({ error: { code: '404', message: 'not found' } });
  }
}
