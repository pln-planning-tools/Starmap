import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';
import { getConfig, getLists, parseIssue } from '../../lib/parser';
import { getGraph } from '../../lib/graph';
import _ from 'lodash';
import { getTimeline } from '../../lib/timeline';
// import Cors from 'cors';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
// const cors = Cors({
//   methods: ['POST', 'GET', 'HEAD'],
// });

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
// function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result: any) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }

//       return resolve(result);
//     });
//   });
// }

const defaultProperties = {};
const defaultPropertiesFromGithub = ['html_url', 'title', 'state', 'node_id'];

const octokit = new Octokit({ auth: process.env.PLN_ADMIN_GITHUB_TOKEN });

const getIssue = async ({ owner, repo, issue_number }) => {
  if (!owner || !repo || !issue_number) return;
  const { data } = await octokit.rest.issues.get({
    mediaType: {
      format: 'html',
    },
    owner,
    repo,
    issue_number,
  });

  return data;
};

const infoFromUrl = (url) => {
  console.log('infoFromUrl | url ->', url);
  const urlSplit = new URL(url).pathname.split('/');
  return { owner: urlSplit[1], repo: urlSplit[2], issue_number: Number(urlSplit[4]) };
};

// Deprecated. @TODO(alexxnica): remove from code
const withChildren = async (response) => {
  const responseWithChildren = (
    await Promise.allSettled(
      response.lists.map(async (list) => ({
        title: list.title,
        childrenIssues: (
          await Promise.allSettled(list.childrenIssues.map((issue) => getIssue(infoFromUrl(issue))))
        ).map((v) => v.status == 'fulfilled' && v.value),
      })),
    )
  ).map((v) => (v.status == 'fulfilled' && v.value) || null);
  const children = responseWithChildren?.map((issue) => {
    return {
      ..._.pick(issue, defaultPropertiesFromGithub),
      config: getConfig(issue.body_html),
      lists: getLists(issue.body_html),
      children: issue.childrenIssues.map((issue) => ({
        ..._.pick(issue, defaultPropertiesFromGithub),
        config: getConfig(issue.body_html),
        lists: getLists(issue.body_html),
        children: null,
      })),
    };
  });

  return {
    ...response,
    children,
  };
};

const withResolvedChildren = async (response) => {
  const responseResolved = {
    ...response,
    lists: (
      await Promise.allSettled(
        response.lists.map(async (list) => ({
          ...list,
          childrenIssues: (
            await Promise.allSettled(list.childrenIssues.map((issueUrl) => getIssue(infoFromUrl(issueUrl))))
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

const withGraph = (response) => {
  return getGraph(response);
};

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
  const { owner, repo, issue_number } = infoFromUrl(url);

  if (!!owner && !!repo && !!issue_number) {
    const issue = await getIssue({ owner, repo, issue_number });
    // console.log('issue ->', issue);
    const response = {
      ..._.pick(issue, defaultPropertiesFromGithub),
      // config: getConfig(issue?.body_html),
      dueDate: getConfig(issue?.body_html)?.eta,
      lists: getLists(issue?.body_html),
    };
    // console.log('_.pick ->', _.pick(issue, defaultPropertiesFromGithub));

    const handleResponse = async ({ response, options }) => {
      // if (options.depth === 1 && response.lists.length > 0) return await withChildren(response);
      if (!!options.graph) return withGraph(await withResolvedChildren(response));
      if (!!options.flattened) return withFlattened(await withResolvedChildren(response));
      if (!!options.timeline && response.lists.length > 0) return getTimeline(await withResolvedChildren(response));
      if (options.depth === 1 && response.lists.length > 0) return await withResolvedChildren(response);
      if (!!response) return response || {};
      return {};
    };

    res.status(200).json(await handleResponse({ response, options }));
  } else {
    res.status(200).json({ message: 'not found' });
  }
}
