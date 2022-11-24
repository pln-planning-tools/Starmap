import { State } from '@hookstate/core';
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

export function convertIssueDataStateToDetailedViewGroupOld(issueDataState: State<IssueData>, viewMode: ViewMode): DetailedViewGroup[] {
  const newIssueData = issueDataState.children.value.map((v) => ({
    ...v,
    group: v.parent?.title ?? '',
    children: v.children.map((x) => ({ ...x, group: x.parent?.title ?? '' })),
  }));

  const issueDataLevelOne: IssueData[] = newIssueData.map((v) => v.children.flat()).flat();

  const issueDataLevelOneGrouped: DetailedViewGroup[] = Array.from(
    group(issueDataLevelOne, (d) => d.group),
    ([key, value]) => ({
      groupName: key,
      items: value,
      url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
    }),
  );

  const issueDataLevelOneIfNoChildren: IssueData[] = newIssueData.map((v) => ({ ...v, children: [v], group: v.title }));
  const issueDataLevelOneIfNoChildrenGrouped: DetailedViewGroup[] = Array.from(
    group(issueDataLevelOneIfNoChildren, (d) => d.group),
    ([key, value]) => ({
      groupName: key,
      items: value,
      url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
    }),
  );

  let issuesGrouped: DetailedViewGroup[];
  if (viewMode === ViewMode.Detail) {
    issuesGrouped =
      (!!issueDataLevelOneGrouped && issueDataLevelOneGrouped.length > 0 && issueDataLevelOneGrouped) ||
      issueDataLevelOneIfNoChildrenGrouped;
  } else {
    issuesGrouped = Array.from(
      group(issueDataState.children.value as IssueData[], (d) => d.group),
      ([key, value]) => ({
        groupName: key,
        items: value,
        url: getInternalLinkForIssue(newIssueData.find((i) => i.title === key)),
      }),
    );
  }

  return reverse(Array.from(sortBy(issuesGrouped, ['groupName'])));
}

export function convertIssueDataToDetailedViewGroup(issueData: IssueData): DetailedViewGroup[] {
  const allIssues = flattenIssueData(issueData);
  const group = allIssues.reduce((viewGroup: DetailedViewGroup[], issueItem: IssueData) => {
    const currentItemsGroupIndex = viewGroup.findIndex((item) => item.groupName === issueItem.parent?.title)
    if (viewGroup[currentItemsGroupIndex] != null) {
      viewGroup[currentItemsGroupIndex].items.push(issueItem);
    } else {
      if (issueItem.parent != null && issueItem.parent.title !== issueData.title) {
        if (issueItem.parent.title == null) {
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
      }
    }
    return viewGroup;
  }, [] as DetailedViewGroup[])

  return reverse(Array.from(sortBy(group, ['groupName'])));
}
