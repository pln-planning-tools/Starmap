import { parseHTML } from 'linkedom';

import { getEtaDate, isValidChildren } from '../utils/regexes';
import { IssueData, ParserGetChildrenResponse } from './types';

export const getConfig = (issue: IssueData['body_html']) => {
  const { document } = parseHTML(issue);
  const issueText = [...document.querySelectorAll('*')].map((v) => v.textContent).join('\n');
  return {
    eta: getEtaDate(issueText),
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
