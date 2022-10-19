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
    .reduce((a: any, b) => {
      const listItem = Object.create({});
      listItem.title = b.previousElementSibling?.textContent?.trim();
      // Get the title only if the heading is level 3
      // listItem.title = b.previousElementSibling?.tagName == 'h3' && b.previousElementSibling?.textContent?.trim();
      listItem.childrenIssues = [...b.querySelectorAll('a[href][data-hovercard-type*="issue"]')]?.map(
        (v: any) => v.href,
      );

      return [...a, listItem];
    }, [])
    .filter((v) => v.childrenIssues.length > 0);
};
