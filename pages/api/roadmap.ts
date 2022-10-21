import type { NextApiRequest, NextApiResponse } from 'next';
import { getChildren, getConfig } from '../../lib/parser';
import {
  getIssue,
  metadataFromIssue,
  filterDefaultFields,
  getIssueWithDepth,
  metadataFromBackend,
} from '../../lib/backend/issue';
import { getUrlParams, urlMatch } from '../../utils/general';
import { IssueData } from '../../lib/types';

const resolveChildren = async (children) => {
  console.log('resolveChildren!');
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

export default async function handler(req: NextApiRequest, res: NextApiResponse<IssueData>) {
  console.log(`API hit: roadmap`, req.query);
  const { platform = 'github', owner, repo, issue_number } = req.query;
  const options = Object.create({});
  options.depth = Number(req.query?.depth);

  if (!platform || !owner || !repo || !issue_number) {
    res.status(400).json({ message: 'URL query is missing fields' });
  }
  try {
    const { error, issueData: rootIssue } = await getIssue({ platform, owner, repo, issue_number });
    if (error) {
      throw error
    }
    const childrenIssues = getChildren(rootIssue?.body_html);

    const toReturn = {
      ...metadataFromIssue(rootIssue),
      ...metadataFromBackend(rootIssue),
      ...filterDefaultFields(rootIssue),
      // children: await resolveChildren(getChildren(rootIssue?.body_html)),
      children: await resolveChildrenWithDepth(getChildren(rootIssue?.body_html)),
    };

    // console.dir(toReturn, { maxArrayLength: Infinity, depth: Infinity });

    res.status(200).json(toReturn);
  } catch (err) {
    console.error('error:', err);
    res.status(404).json({ message: 'not found' });
  }
}
