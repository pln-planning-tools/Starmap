import { parseHTML } from 'linkedom';

export const parseIssue = (issueBody) => {
  // console.log('issueBody ->', issueBody);
  const { document } = parseHTML(issueBody);

  const lists = [...document.querySelectorAll('ul')]
    .reduce((a: any, b) => {
      const listItem = Object.create({});
      listItem.title = b.previousElementSibling?.textContent?.trim();
      // Get the title only if the heading is level 3
      // listItem.title = b.previousElementSibling?.tagName == 'h3' && b.previousElementSibling?.textContent?.trim();
      // @ts-ignore
      listItem.references = [...b.querySelectorAll('a[href][data-hovercard-type*="issue"]')]?.map((v) => v.href);

      return [...a, listItem];
    }, [])
    .filter((v) => v.references.length > 0);

  // console.log(lists);

  // nodeType 3 == Text Node
  const config =
    (document.querySelector('p:first-child') &&
      document.querySelector('p:first-child')?.childNodes &&
      Object.fromEntries(
        // @ts-ignore
        [...document.querySelector('p:first-child').childNodes]
          .filter((v) => v.nodeType === 3)
          .map((v) => v.textContent?.trim().split(':')),
      )) ||
    {};

  // console.log('config ->', config);

  return {
    config,
    lists,
  };
};
