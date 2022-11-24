import { group } from 'd3';
import { groupBy, reverse, sortBy, uniqBy } from 'lodash';
import { ViewMode } from '../enums';
import { getInternalLinkForIssue } from '../general';

import { DetailedViewGroup, IssueData } from '../types';

function flattenIssueData(issueData: IssueData, isChildIssue = false): IssueData[] {
  const parentArray: IssueData[] = []
  if (isChildIssue) {
    parentArray.push(issueData)
  }
  const childrenArray = issueData.children.flatMap((child) => flattenIssueData(child, true))
  return uniqBy(parentArray.concat(childrenArray), 'html_url')
}


function getGroupedChildren(childrenIssues: IssueData[]): IssueData[] {

  let numChildren = 0;
  const groupedChildren = childrenIssues.map((issueDataChild) => {
    numChildren++
    return {
      ...issueDataChild,
      group: issueDataChild.parent?.title ?? 'no parent title',
      children: issueDataChild.children.map((issueDataGrandchild) => {
        numChildren++
        return ({ ...issueDataGrandchild, group: issueDataChild.parent?.title ?? 'no parent title' })
      }),
    };
  });

  console.log(`debug issuesGrouped - numChildren: `, numChildren);

  return groupedChildren;
}

export function convertIssueDataToDetailedViewGroupOld(issueData: IssueData, viewMode: ViewMode): DetailedViewGroup[] {
  const childrenIssues = issueData.children;
  const newIssueData = getGroupedChildren(childrenIssues)
  const issueDataLevelOne: IssueData[] = childrenIssues.map((v) => v.children.flat()).flat();
  console.log(`debug issuesGrouped - issueDataLevelOne: `, issueDataLevelOne);

  const issueDataLevelOneGrouped: DetailedViewGroup[] = Array.from(
    group(issueDataLevelOne, (d) => d.group),
    ([key, value]) => ({
      groupName: key,
      items: value,
      url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
    }),
  );
  console.log(`debug issuesGrouped - issueDataLevelOneGrouped: `, issueDataLevelOneGrouped);

  const issueDataLevelOneIfNoChildren: IssueData[] = newIssueData.map((v) => ({ ...v, children: [v], group: v.title }));
  console.log(`debug issuesGrouped - issueDataLevelOneIfNoChildren: `, issueDataLevelOneIfNoChildren);
  const issueDataLevelOneIfNoChildrenGrouped: DetailedViewGroup[] = Array.from(
    group(issueDataLevelOneIfNoChildren, (d) => d.group),
    ([key, value]) => ({
      groupName: key,
      items: value,
      url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key) as IssueData),
    }),
  );

  console.log(`debug issuesGrouped - issueDataLevelOneIfNoChildrenGrouped: `, issueDataLevelOneIfNoChildrenGrouped);

  let newGroupedIssues: DetailedViewGroup[] = [];
  if (viewMode === ViewMode.Detail) {
    newGroupedIssues = (!!issueDataLevelOneGrouped && issueDataLevelOneGrouped.length > 0 && issueDataLevelOneGrouped) ||
      issueDataLevelOneIfNoChildrenGrouped

    // issuesGrouped = (!!issueDataLevelOneGrouped && issueDataLevelOneGrouped.length > 0 && issueDataLevelOneGrouped) ||
    //   issueDataLevelOneIfNoChildrenGrouped;
  } else {
    newGroupedIssues = Array.from(
      group(issueData.children as IssueData[], (d) => d.group),
      ([key, value]) => ({
        groupName: key,
        items: value,
        url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
      }),
    );
    // issuesGrouped = Array.from(
    //   group(issueDataState.children as IssueData[], (d) => d.group),
    //   ([key, value]) => ({
    //     groupName: key,
    //     items: value,
    //     url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
    //   }),
    // );
  }
    return reverse(Array.from(sortBy(newGroupedIssues, ['groupName'])))
}

export function convertIssueDataToDetailedViewGroup(issueData: IssueData): DetailedViewGroup[] {
  // const detailedViewGroup: DetailedViewGroup[] = [];

  const allIssues = flattenIssueData(issueData);
  console.log(`debug issuesGrouped - convertIssueDataToDetailedViewGroup - allIssues.length: `, allIssues.length);
  const group = allIssues.reduce((viewGroup: DetailedViewGroup[], issueItem: IssueData) => {
    // console.log(`viewGroup: `, viewGroup);
    const currentItemsGroupIndex = viewGroup.findIndex((item) => item.groupName === issueItem.parent?.title)
    // console.log(`viewGroup[currentItemsGroupIndex]: `, viewGroup[currentItemsGroupIndex]);
    if (viewGroup[currentItemsGroupIndex] != null) {
      viewGroup[currentItemsGroupIndex].items.push(issueItem);
    } else {
      if (issueItem.parent != null && issueItem.parent.title !== issueData.title) {
        // return
        if (issueItem.parent.title == null) {
          console.log('debug issuesGrouped - convertIssueDataToDetailedViewGroup - issueItem has no parent title', issueItem);
        } else {
          viewGroup.push({
            groupName: issueItem.parent.title ?? 'no title for issue with parent',
            items: [issueItem],
            url: getInternalLinkForIssue(issueItem)
          })
        }
      } else if (issueItem.children?.length > 0) {
        // issueItem has no parent, so it probably is a parent
        viewGroup.push({
          groupName: issueItem.title ?? 'no title for issue with no parent',
          items: [],
          url: getInternalLinkForIssue(issueItem)
        })
        // throw new Error('No parent');
      }
    }
    return viewGroup;
  }, [] as DetailedViewGroup[])
  // newGroupedIssues,

  return reverse(Array.from(sortBy(group, ['groupName'])));
  // const groupedByParentUrl = groupBy<IssueData>(allIssues, (issue) => issue.parent?.html_url)

  // Object.keys(groupedByParentUrl).forEach((parentTitle) => {
  //   const group = groupedByParentUrl[parentTitle];
  //   detailedViewGroup.push({

  //   })
  // })

  // return detailedViewGroup;

}
