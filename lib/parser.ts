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
    eta = getEtaDate(issueText)
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

function getSectionLines(text: string, sectionHeader: string) {
  const sectionIndex = text.indexOf(sectionHeader);
  if (sectionIndex === -1) {
    return [];
  }
  const lines = text.substring(sectionIndex).split(/[\r\n]+/).slice(1);
  return lines;
}

const splitAndGetLastItem = (line: string) => line.trim().split(' ').slice(-1)[0]
const ensureTaskListChild = (line: string) => line.trim().indexOf('-') === 0

function getUrlStringForChildrenLine(line: string, issue: Pick<GithubIssueData, 'html_url'>) {
  if (/^#\d+$/.test(line)) {
    const { owner, repo } = paramsFromUrl(issue.html_url)
    line = `${owner}/${repo}${line}`
  }
  return getValidUrlFromInput(line).href
}
/**
 * We attempt to parse the issue.body for children included in 'tasklist' format
 * @see https://github.com/pln-planning-tools/Starmap/issues/245
 *
 * @param {string} issue_body
 */
function getChildrenFromTaskList(issue: Pick<GithubIssueData, 'body' | 'html_url'>): ParserGetChildrenResponse[] {
  // tasklists require the checkbox style format to recognize children
  const lines = getSectionLines(issue.body, '```[tasklist]')
    .filter(ensureTaskListChild)
    .map(splitAndGetLastItem)
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error('Section missing or has no children')
  }

  const children: ParserGetChildrenResponse[] = lines.map((line) => ({
      group: 'tasklist',
      html_url: getUrlStringForChildrenLine(line, issue),
    }));
  return children
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
  const lines = getSectionLines(issue.body, 'children:').map((line) => line.trim().split(' ').slice(-1)[0]).filter(Boolean);
  if (lines.length === 0) {
    throw new Error('Section missing or has no children')
  }

  // guard against HTML tags (covers cases where this method is called with issue.body_html instead of issue.body_text)
  if (lines.some((line) => line.startsWith('<'))) {
    throw new Error('HTML tags found in body_text');
  }

  const children: ParserGetChildrenResponse[] = []

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i]
    if (currentLine.length <= 0) {
      if (children.length === 0) {
        // skip empty lines between children header and children
        continue
      } else {
        // end of children if empty line is found and children is not empty
        break
      }
    }

    try {
      children.push({
        group: 'children:',
        html_url: getUrlStringForChildrenLine(currentLine, issue)
      })
    } catch {
      // invalid URL or child issue identifier, exit and return what we have
      break
    }
  }

  return children

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
