import type { NextApiRequest, NextApiResponse } from 'next';
import { getConfig, getLists, parseIssue } from '../../lib/parser';
import { getGraph } from '../../lib/graph';
import _ from 'lodash';
import { getTimeline } from '../../lib/timeline';
import { getIssue } from '../../lib/backend/getIssue';

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
  // console.dir(responseResolved, { depth: 100, maxArrayLength: 100 });
  return responseResolved || {};
};

const withGraph = (response) => getGraph(response);

const withFlattened = (response) => {
  const changeResponse = (res) => ({
    ..._.pick(response, defaultPropertiesFromGithub),
    dueDate: response.config?.eta,
    children: response.lists?.find((v) => v.title?.toLowerCase()?.includes('children'))?.childrenIssues,
  });
  return {
    ..._.pick(response, defaultPropertiesFromGithub),
    dueDate: response.config?.eta,
    children: response.lists
      ?.find((v) => v.title?.toLowerCase()?.includes('children'))
      ?.childrenIssues?.map((v) => ({
        ..._.pick(v, defaultPropertiesFromGithub),
        children: response.lists?.find((v) => v.title?.toLowerCase()?.includes('children'))?.childrenIssues,
      })),
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`API hit: github-issue`, req.query);
  // Run the middleware
  // await runMiddleware(req, res, cors);
  const { url }: any = req.query;
  const options = {
    depth: Number(req.query?.depth),
    graph: Boolean(req.query?.graph),
    flattened: Boolean(req.query?.flattened),
    timeline: Boolean(req.query?.timeline),
  };

  try {
    const issue = await getIssue(url);
    // console.log('issue ->', issue);
    const response = {
      ..._.pick(issue, defaultPropertiesFromGithub),
      // config: getConfig(issue?.body_html),
      dueDate: getConfig(issue?.body_html)?.eta,
      lists: getLists(issue?.body_html),
    };

    const handleResponse = async ({ response, options }) => {
      if (!!options.graph) return withGraph(await withResolvedChildren(response));
      if (!!options.flattened) return withFlattened(await withResolvedChildren(response));
      if (!!options.timeline && response.lists.length > 0) return getTimeline(await withResolvedChildren(response));
      if (options.depth === 1 && response.lists.length > 0) return await withResolvedChildren(response);
      if (!!response) return response || {};
      return {};
    };

    res.status(200).json(await handleResponse({ response, options }));
  } catch {
    res.status(200).json({ message: 'not found' });
  }
}
