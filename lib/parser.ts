import { parseHTML } from 'linkedom';
import { getEtaDate } from '../utils/regexes';

export const getConfig = (issue) => {
  const { document } = parseHTML(issue);
  const issueText = [...document.querySelectorAll('*')].map((v) => v.textContent).join('\n');
  return {
    eta: getEtaDate(issueText),
  };
};

export const getLists = (issue) => {
  const { document } = parseHTML(issue);
  return [...document.querySelectorAll('ul')]
    .slice(0, 1)
    .reduce((a: any, b) => {
      const listItem = Object.create({});
      listItem.title = b.previousElementSibling?.textContent?.trim();
      // listItem.childrenIssues = [...b.querySelectorAll('a[href][data-hovercard-type*="issue"]')]?.map(
      listItem.children = [...b.querySelectorAll('a[href][data-hovercard-type*="issue"]')]?.map(
        (v: any) => v.href,
      );

      return [...a, listItem];
    }, [])
    .filter((v) => v.children.length > 0);
};

export const getChildren = (issue) => {
  const { document } = parseHTML(issue);
  const ulLists = [...document.querySelectorAll('ul')];
  const firstUlList = ulLists.slice(0, 1);
  const children = firstUlList
    .reduce((a: any, b) => {
      const hrefs = [...b.querySelectorAll('a[href][data-hovercard-type*="issue"]')]?.map((v: any) => v.href);

      return [...a, hrefs];
    }, [])
    .flat()
    .map((v) => ({
      html_url: v,
    }));
  const childrenDepth = children.filter((v) => v.children?.length > 0)?.length;
  // console.log('children', children);

  return [...children];
};
