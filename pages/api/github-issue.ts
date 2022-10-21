import type { NextApiRequest, NextApiResponse } from 'next'
import { getConfig, getLists } from '../../lib/parser'
import _ from 'lodash'
import { getIssue } from '../../lib/backend/getIssue'
import { GithubIssueApiResponse } from '../../lib/types'

const defaultPropertiesFromGithub = ['html_url', 'title', 'state', 'node_id']

const withResolvedChildren = async (response) => {
  const responseResolved = {
    ...response,
    percent_done: 70,
    lists: (
      await Promise.allSettled(
        response.lists.map(async (list) => ({
          ...list,
          childrenIssues: (
            await Promise.allSettled(list.childrenIssues.map(async (issueUrl) => await getIssue(issueUrl)))
          )
            .map((v) => v.status === 'fulfilled' && v.value)
            .map((issue) => ({
              ..._.pick(issue, defaultPropertiesFromGithub),
              // config: getConfig(issue?.body_html),
              dueDate: getConfig(issue?.body_html)?.eta,
              lists: getLists(issue?.body_html),
              percent_done: 70,
              parent_html_url: response.html_url,
            })),
        })),
      )
    ).map((v) => v.status === 'fulfilled' && v.value),
  }
  return responseResolved || {}
}

const handleResponse = async ({ response, options }) => {
  // const {responseData} = response;
  console.log('response: ', response)
  if (options.depth === 1 && response.lists.length > 0) {
    return await withResolvedChildren(response)
  }
  if (response) {
    return response || {}
  }
  return {}
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<GithubIssueApiResponse>) {
  console.log('API hit: github-issue', req.query)
  const { url }: any = req.query

  try {
    const issue = await getIssue(url)
    const dueDate = getConfig(issue?.body_html)?.eta
    if (dueDate == null) {
      res.status(500).json({ error: `No due date found in issue body of ${url}`, issueData: null })
      return
    }
    const responseData = {
      ..._.pick(issue, defaultPropertiesFromGithub),
      // config: getConfig(issue?.body_html),
      dueDate,
      lists: getLists(issue?.body_html),
    }
    const response = {
      error: null,
      issueData: await handleResponse({ response: responseData, options: { depth: Number(req.query?.depth) } }),
    }


    res.status(200).json(response)
  } catch {
    res.status(200).json({ error: 'not found', issueData: null })
  }
}
