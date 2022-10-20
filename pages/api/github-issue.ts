import type { NextApiRequest, NextApiResponse } from 'next';
import { getConfig, getLists } from '../../lib/parser';
import _ from 'lodash';
import { getIssue } from '../../lib/backend/issue';

const defaultPropertiesFromGithub = ['html_url', 'title', 'state', 'node_id'];

const withResolvedChildren = async (response) => {
  const responseResolved = {
    ...response,
    lists: (
      await Promise.allSettled(
        response.lists.map(async (list) => ({
          ...list,
          childrenIssues: (
            await Promise.allSettled(list.childrenIssues.map((issueUrl) => getIssue(issueUrl)))
          )
            .map((v) => v.status == 'fulfilled' && v.value)
            .map((issue) => ({
              ..._.pick(issue, defaultPropertiesFromGithub),
              // config: getConfig(issue?.body_html),
              dueDate: getConfig(issue?.body_html)?.eta,
              lists: getLists(issue?.body_html),
            })),
        })),
      )
    ).map((v) => v.status == 'fulfilled' && v.value),
  };
  return responseResolved || {};
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`API hit: github-issue`, req.query);
  const { url }: any = req.query;

  try {
    const issue = await getIssue(url);
    const response = {
      ..._.pick(issue, defaultPropertiesFromGithub),
      // config: getConfig(issue?.body_html),
      dueDate: getConfig(issue?.body_html)?.eta,
      lists: getLists(issue?.body_html),
    };

    const handleResponse = async ({ response, options }) => {
      if (options.depth === 1 && response.lists.length > 0) return await withResolvedChildren(response);
      if (!!response) return response || {};
      return {};
    };

    res.status(200).json(await handleResponse({ response, options: { depth: Number(req.query?.depth) } }));
  } catch {
    res.status(200).json({ message: 'not found' });
  }
}
