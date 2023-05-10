import { parseHTML } from 'linkedom';
import { ErrorManager } from './backend/errorManager';
import { getValidUrlFromInput } from './getValidUrlFromInput';
import { getEtaDate, isValidChildren } from './helpers';
import { paramsFromUrl } from './paramsFromUrl';
import { GithubIssueData, GithubIssueDataWithChildren, ParserGetChildrenResponse } from './types';

export const getDueDate = (issue: Pick<GithubIssueDataWithChildren, 'html_url' | 'body_html' | 'root_issue' | 'title'>, errorManager: ErrorManager) => {
  const { body_html: issueBodyHtml } = issue;

  const { document } = parseHTML(issueBodyHtml);
  const issueText = [...document.querySelectorAll('*')].map((v) => v.textContent).join('\n');
  let eta: string | null = null;
  try {
    eta = getEtaDate(issueText, { addError: errorManager.addError.bind(errorManager), issue })
  } catch (e) {
    if (issue.html_url != null && issue.root_issue !== true) {
      errorManager.addError({
        issue,
        userGuideSection: '#eta',
        errorTitle: 'ETA not found',
        errorMessage: 'ETA not found in issue body',
      });
    }
  }

  return {
    eta: eta ?? '',
  };
};

function regexIndexOf(string: string, regex: RegExp, startpos = 0) {
  const indexOf = string.substring(startpos).search(regex);
  if (indexOf >= 0) {
    return indexOf + startpos
  }
  return indexOf;
}

function indexOf(string: string, strOrRegex: string | RegExp, startpos = 0) {
  if (typeof strOrRegex === 'string') {
    return string.indexOf(strOrRegex, startpos)
  }
  return regexIndexOf(string, strOrRegex, startpos)
}

function getSectionLines(text: string, sectionHeader: string | RegExp): string {
  const sectionStartIndex = indexOf(text, sectionHeader);
  if (sectionStartIndex === -1) {
    return '';
  }
  const startText = text.substring(sectionStartIndex)
  /**
   * sectionEndIndex marks the location of the first double line break
   * i.e. first empty line
   */
  const sectionEndIndex = regexIndexOf(startText, /^[\r\n]{2,}$/gm)
  if (sectionEndIndex === -1) {
    return startText
  }
  return startText.substring(0, sectionEndIndex)
}

function getCleanedSectionLines(text: string, sectionHeader: string | RegExp) {
  const lines = getSectionLines(text, sectionHeader)
  if (typeof lines === 'string') {
    return lines.split(/[\r\n]+/).slice(1)
      .map(getUrlFromMarkdownText)
  }
  return lines
}

const splitAndGetLastItem = (line: string) => line.trim().split(' ').slice(-1)[0]
const ensureTaskListChild = (line: string) => line.trim().indexOf('-') === 0
const getUrlFromMarkdownText = (line: string) => line.trim().split('](').slice(-1)[0].replace(')', '')

function getUrlStringForChildrenLine(line: string, issue: Pick<GithubIssueData, 'html_url'>) {
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
function getChildrenFromTaskList(issue: Pick<GithubIssueData, 'body' | 'html_url'>): ParserGetChildrenResponse[] {
  // tasklists require the checkbox style format to recognize children
  const lines = getCleanedSectionLines(issue.body, '```[tasklist]')
    .filter(ensureTaskListChild)
    .map(splitAndGetLastItem)
    .filter(Boolean);

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
function getChildrenNew(issue: Pick<GithubIssueData, 'body' | 'html_url'>): ParserGetChildrenResponse[] {

  try {
    return getChildrenFromTaskList(issue);
  } catch (e) {
    // Could not find children using new tasklist format,
    // try to look for "children:" section
  }
  const lines = getCleanedSectionLines(issue.body, /children:/i).map(splitAndGetLastItem).filter(Boolean);
  if (lines.length === 0) {
    throw new Error('Section missing or has no children')
  }

  // guard against HTML tags (covers cases where this method is called with issue.body_html instead of issue.body_text)
  if (lines.some((line) => line.startsWith('<'))) {
    throw new Error('HTML tags found in body_text');
  }

  return convertLinesToChildren(lines, issue, 'children:')
}

function getValidChildrenLinks(lines: string[], issue: Pick<GithubIssueData, 'html_url'>): string[] {
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

function convertLinesToChildren(lines: string[], issue: Pick<GithubIssueData, 'html_url'>, group: string): ParserGetChildrenResponse[] {
  const validChildrenLinks = getValidChildrenLinks(lines, issue)

  return validChildrenLinks
    .map((html_url): ParserGetChildrenResponse => ({
      group,
      html_url,
    }))
}

export const getChildren = (issue: Pick<GithubIssueData, 'body_html' | 'body' | 'html_url'>): ParserGetChildrenResponse[] => {
  try {
    return getChildrenNew(issue);
  } catch (e) {
    // ignore failures for now, fallback to old method.
  }
  const { document } = parseHTML(issue.body_html);
  const ulLists = [...document.querySelectorAll('ul')];
  const filterListByTitle = (ulLists) =>
    ulLists.filter((list) => {
      const title = list.previousElementSibling?.textContent?.trim();

      return !!isValidChildren(title);
    });

  const children = filterListByTitle(ulLists)
    .reduce((a: any, b) => {
      const listTitle = b.previousElementSibling?.textContent?.trim();
      const hrefSelector = [...b.querySelectorAll('a[href][data-hovercard-type*="issue"]')];
      const listHrefs = hrefSelector?.map((v: any) => v.href);

      return [...a, { group: listTitle, hrefs: listHrefs }];
    }, [])
    .flat()
    .map((item) => item.hrefs.map((href) => ({ html_url: href, group: item.group })))
    .flat();

  return [...children];
};

/**
 * Search for "description: " in the issue body, and return all text after that
 * except for the first empty line it finds
 *
 * @param {string} issueBodyText
 *
 * @returns {string}
 */
export const getDescription = (issueBodyText: string): string => {
  if (issueBodyText.length === 0) return '';

  const [firstLine, ...linesToParse] = getSectionLines(issueBodyText, 'description:')
    .split(/\r\n|\r|\n/) // We do not want to replace multiple newlines, only one.

  // the first line may contain only "description:" or "description: This is the start of my description"
  const firstLineContent = firstLine
      .replace(/^.{0,}description:/, '')
      .replace(/-->/g, '') // may be part of an HTML comment so it's hidden from the user. Remove the HTML comment end tag
      .trim();

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

  return descriptionLines.join('\n');
}
