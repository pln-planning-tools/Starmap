import type { NextApiRequest, NextApiResponse } from 'next';
import { getChildren, getConfig } from '../../lib/parser';
import _ from 'lodash';
import { getIssue } from '../../lib/backend/issue';

const resolveChildren = async (children) => {
  const allSettled = await Promise.allSettled(children.map((child) => getIssue(child)));
  return allSettled.map((v) => v.status == 'fulfilled' && v.value);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`API hit: github-issue-v2`, req.query);
  const { url }: any = req.query;
  const options = Object.create({});
  options.depth = Number(req.query?.depth);

  try {
    const rootIssue = await getIssue(url);

    res.status(200).json({
      html_url: rootIssue?.html_url,
      title: rootIssue?.title,
      dueDate: getConfig(rootIssue?.body_html)?.eta,
      state: rootIssue?.state,
      node_id: rootIssue?.node_id,
      children: await resolveChildren(getChildren(rootIssue?.body_html)),
    });
  } catch (err) {
    console.log('error:', err);
    res.status(200).json({ message: 'not found' });
  }
}
