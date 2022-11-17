import { parseHTML } from 'linkedom';
import { errorManager } from './backend/errorManager';

import { getEtaDate, isValidChildren } from './helpers';
import { IssueData, ParserGetChildrenResponse, StarMapsError } from './types';

export const getConfig = (issue: IssueData) => {
  const { body_html: issueBodyHtml } = issue;

  const { document } = parseHTML(issueBodyHtml);
  const issueText = [...document.querySelectorAll('*')].map((v) => v.textContent).join('\n');
  let eta: string | null = null;
  try {
    eta = getEtaDate(issueText)
  } catch (e) {
    if (issue.html_url != null && issue.root_issue !== true) {
      errorManager.addError({
        issueUrl: issue.html_url,
        issueTitle: issue.title,
        userGuideUrl: 'https://github.com/pln-planning-tools/Starmaps/blob/main/User%20Guide.md#eta',
        title: 'ETA not found',
        message: 'ETA not found in issue body',
      });
    }
  }

  return {
    eta: eta == null ? '' : eta,
  };
};

export const getChildren = (issue: string): ParserGetChildrenResponse[] => {
  const { document } = parseHTML(issue);
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
    .map((item) => {
      return item.hrefs.map((href) => {
        return { html_url: href, group: item.group };
      });
    })
    .flat();

  return [...children];
};
