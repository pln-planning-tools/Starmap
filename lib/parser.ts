import { parseHTML } from 'linkedom'

import { ErrorManager } from './backend/errorManager'
import { getValidUrlFromInput } from './getValidUrlFromInput'
import { getEtaDate, isValidChildren } from './helpers'
import { paramsFromUrl } from './paramsFromUrl'
import { GithubIssueData, GithubIssueDataWithChildren, ParserGetChildrenResponse } from './types'
import { isNonEmptyString } from './typescriptGuards'
import { betweenTwoRegex } from './utils/strings'

export const getDueDate = (issue: Pick<GithubIssueDataWithChildren, 'html_url' | 'body_html' | 'root_issue' | 'title'>, errorManager: ErrorManager) => {
  const { body_html: issueBodyHtml } = issue

  const { document } = parseHTML(issueBodyHtml)
  const issueText = [...document.querySelectorAll('*')].map((v) => v.textContent).join('\n')
  let eta: string | null = null
  try {
    eta = getEtaDate(issueText, { addError: errorManager.addError.bind(errorManager), issue })
  } catch (e) {
    if (issue.html_url != null && issue.root_issue !== true) {
      errorManager.addError({
        issue,
        userGuideSection: '#eta',
        errorTitle: 'ETA not found',
        errorMessage: 'ETA not found in issue body'
      })
    }
  }

  return {
    eta: eta ?? ''
  }
}

/**
 * Function that splits a space separated string into an array of strings and
 * returns the first github issue ID or link it finds.
 *
 * @param line a string most-likely containing a link in it somewhere.
 * @returns {string}
 */
const getGithubLinkFromLine = (line: string): string | null => {
  const trimmedLine = line.trim()
  if (trimmedLine.length === 0) {
    return ''
  }
  const trimmedLinePieces = trimmedLine.split(' ')

  // return the first valid link found
  return trimmedLinePieces.find((linePiece) => {
    if (linePiece.length <= 1) {
      return false
    }
    try {
      // try github issue IDs
      getValidUrlFromInput(linePiece.replace(/pull/g, 'issues'))
      return true
    } catch {
      return false
    }
  }) ?? null
}
const ensureTaskListChild = (line: string) => line.trim().indexOf('-') === 0

function getUrlStringForChildrenLine (line: string, issue: Pick<GithubIssueData, 'html_url'>) {
  if (/^#\d+$/.test(line)) {
    const { owner, repo } = paramsFromUrl(issue.html_url)
    line = `${owner}/${repo}${line}`
  }
  if (line.includes('/pull/')) {
    /**
     * getValidUrlFromInput requires a valid issue url, so we replace /pull/
     * with /issues/ since github will recognize the pull request URL as a valid
     * issue url
     */
    line = line.replace('/pull/', '/issues/')
  }
  const url = getValidUrlFromInput(line)
  if (!url.host.includes('github.com')) {
    throw new Error('Invalid host for children item')
  }
  return url.href
}
/**
 * We attempt to parse the issue.body for children included in 'tasklist' format
 * @see https://github.com/pln-planning-tools/Starmap/issues/245
 *
 * @param {string} issue_body
 */
function getChildrenFromTaskList (issue: Pick<GithubIssueData, 'body' | 'html_url'>): ParserGetChildrenResponse[] {
  // tasklists require the checkbox style format to recognize children
  const lines = betweenTwoRegex(issue.body, /^```\[tasklist\][\r\n]+/m, /^```$/m).split(/[\r\n]+/)
    .filter(ensureTaskListChild)
    .map(getGithubLinkFromLine)
    .filter(isNonEmptyString)

  if (lines.length === 0) {
    throw new Error('Section missing or has no children')
  }

  return convertLinesToChildren(lines, issue, 'tasklist')
}

/**
 * A new version of getchildren which parses the issue body_text instead of issue body_html
 *
 * This function must support recognizing the current issue's organization and repo, because some children may simply be "#43" instead of a github short-id such as "org/repo#43"
 * @param {string} issue
 */
function getChildrenNew (issue: Pick<GithubIssueData, 'body' | 'html_url'>): ParserGetChildrenResponse[] {
  try {
    return getChildrenFromTaskList(issue)
  } catch (e) {
    // Could not find children using new tasklist format,
    // try to look for "children:" section
  }
  const lines = betweenTwoRegex(issue.body, /^\s*children:\s*[\r\n]+/im, /^[\r\n]{2,}$/m).split(/[\r\n]+/)
    .map(getGithubLinkFromLine)
    .filter(isNonEmptyString)
  if (lines.length === 0) {
    throw new Error('Section missing or has no children')
  }

  // guard against HTML tags (covers cases where this method is called with issue.body_html instead of issue.body_text)
  if (lines.some((line) => line.startsWith('<'))) {
    throw new Error('HTML tags found in body_text')
  }

  return convertLinesToChildren(lines, issue, 'children:')
}

function getValidChildrenLinks (lines: string[], issue: Pick<GithubIssueData, 'html_url'>): string[] {
  const validChildrenLinks: string[] = []
  for (const line of lines) {
    try {
      validChildrenLinks.push(getUrlStringForChildrenLine(line, issue))
    } catch (e) {
      break
    }
  }
  return validChildrenLinks
}

function convertLinesToChildren (lines: string[], issue: Pick<GithubIssueData, 'html_url'>, group: string): ParserGetChildrenResponse[] {
  const validChildrenLinks = getValidChildrenLinks(lines, issue)

  return validChildrenLinks
    .map((html_url): ParserGetChildrenResponse => ({
      group,
      html_url
    }))
}

export const getChildren = (issue: Pick<GithubIssueData, 'body_html' | 'body' | 'html_url'>): ParserGetChildrenResponse[] => {
  try {
    return getChildrenNew(issue)
  } catch (e) {
    // ignore failures for now, fallback to old method.
  }
  const { document } = parseHTML(issue.body_html)
  const ulLists = [...document.querySelectorAll('ul')]
  const filterListByTitle = (ulLists) =>
    ulLists.filter((list) => {
      const title = list.previousElementSibling?.textContent?.trim()

      return !!isValidChildren(title)
    })

  const children = filterListByTitle(ulLists)
    .reduce((a: any, b) => {
      const listTitle = b.previousElementSibling?.textContent?.trim()
      const hrefSelector = [...b.querySelectorAll('a[href][data-hovercard-type*="issue"]')]
      const listHrefs = hrefSelector?.map((v: any) => v.href)

      return [...a, { group: listTitle, hrefs: listHrefs }]
    }, [])
    .flat()
    .map((item) => item.hrefs.map((href) => ({ html_url: href, group: item.group })))
    .flat()

  return [...children]
}

/**
 * Search for "description: " in the issue body, and return all text after that
 * except for the first empty line it finds
 *
 * @param {string} issueBodyText
 *
 * @returns {string}
 */
export const getDescription = (issueBodyText: string): string => {
  if (issueBodyText.length === 0) return ''
  let sectionText = ''
  try {
    sectionText = betweenTwoRegex(issueBodyText, /description:/im, /^[\r\n]{2,}$/gm)
  } catch {
    // return empty string, no description text found.
    return ''
  }

  // We do not want to replace multiple newlines, only one.
  const [firstLine, ...linesToParse] = sectionText.split(/\r\n|\r|\n/)

  // the first line may contain only "description:" or "description: This is the start of my description"
  const firstLineContent = firstLine
    .replace(/^.{0,}description:/, '')
    .replace(/-->/g, '') // may be part of an HTML comment so it's hidden from the user. Remove the HTML comment end tag
    .trim()

  const descriptionLines: string[] = []
  if (firstLineContent !== '') {
    descriptionLines.push(firstLineContent)
  }

  for (const line of linesToParse.map((line) => line.trim())) {
    if (line === '' || /children:/i.test(line) || line.includes('```[tasklist]') || /eta:/i.test(line)) {
      break
    }
    descriptionLines.push(line.trim())
  }

  return descriptionLines.join('\n')
}
