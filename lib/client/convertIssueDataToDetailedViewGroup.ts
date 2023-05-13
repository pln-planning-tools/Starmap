import { State, ImmutableArray } from '@hookstate/core'
import { group } from 'd3'
import { reverse, sortBy, uniqBy } from 'lodash'

import { ViewMode } from '../enums'
import { getLinkForRoadmapChild } from './getLinkForRoadmapChild'
import { DetailedViewGroup, IssueData } from '../types'
import { ParsedUrlQuery } from 'querystring'

function flattenIssueData (issueData: IssueData, isChildIssue = false): IssueData[] {
  const parentArray: IssueData[] = []
  if (isChildIssue) {
    parentArray.push(issueData)
  }
  const childrenArray = issueData.children.flatMap((child) => flattenIssueData(child, true))
  return uniqBy(parentArray.concat(childrenArray), 'html_url')
}

export function convertIssueDataStateToDetailedViewGroupOld (issueDataState: State<IssueData>, viewMode: ViewMode, parsedQuery: ParsedUrlQuery): DetailedViewGroup[] {
  const newIssueData = issueDataState.children.value.map((v) => ({
    ...v,
    group: v.parent?.title ?? '',
    children: v.children.map((x) => ({ ...x, group: x.parent?.title ?? '' }))
  }))

  const getGroupedIssues = (issueData: ImmutableArray<IssueData>): DetailedViewGroup[] => Array.from(
    group(issueData, (d) => d.group),
    ([key, value]) => ({
      groupName: key,
      items: value,
      url: getLinkForRoadmapChild({ issueData: newIssueData.find((i) => i.title === key), query: parsedQuery })
    })
  )

  const issueDataLevelOneIfNoChildren: ImmutableArray<IssueData> = newIssueData.map((v) => ({ ...v, children: [v], group: v.title }))

  const issueDataLevelOne: ImmutableArray<IssueData> = newIssueData.map((v) => v.children.flat()).flat()
  const issueDataLevelOneGrouped: DetailedViewGroup[] = getGroupedIssues(issueDataLevelOne)
  const issueDataLevelOneIfNoChildrenGrouped: DetailedViewGroup[] = getGroupedIssues(issueDataLevelOneIfNoChildren)

  let issuesGrouped: DetailedViewGroup[]
  if (viewMode === ViewMode.Detail) {
    if (issueDataLevelOneGrouped.length > 0) {
      issuesGrouped = issueDataLevelOneGrouped
    } else {
      issuesGrouped = issueDataLevelOneIfNoChildrenGrouped
    }
  } else {
    issuesGrouped = Array.from(
      group(issueDataState.children.value as IssueData[], (d) => d.group),
      ([key, value]) => ({
        groupName: key,
        items: value,
        url: getLinkForRoadmapChild({ issueData: newIssueData.find((i) => i.title === key), query: parsedQuery })
      })
    )
  }

  return reverse(Array.from(sortBy(issuesGrouped, ['groupName'])))
}

export function convertIssueDataToDetailedViewGroup (issueData: IssueData): DetailedViewGroup[] {
  const allIssues = flattenIssueData(issueData)
  interface MutableDetailedViewGroup extends DetailedViewGroup {
    items: IssueData[]
  }
  const group = allIssues.reduce((viewGroup: MutableDetailedViewGroup[], issueItem: IssueData) => {
    const currentItemsGroupIndex = viewGroup.findIndex((item) => item.groupName === issueItem.parent?.title)
    if (viewGroup[currentItemsGroupIndex] != null) {
      viewGroup[currentItemsGroupIndex].items.push(issueItem)
    } else {
      if (issueItem.parent != null && issueItem.parent.title !== issueData.title) {
        if (issueItem.parent.title == null) {
          console.error('issueItem.parent.title is null')
        } else {
          viewGroup.push({
            groupName: issueItem.parent.title ?? 'no title for issue with parent',
            items: [issueItem],
            url: getLinkForRoadmapChild({ issueData: issueItem, currentRoadmapRoot: issueData })
          })
        }
      } else if (issueItem.children?.length > 0) {
        // issueItem has no parent, so it probably is a parent
        viewGroup.push({
          groupName: issueItem.title ?? 'no title for issue with no parent',
          items: [],
          url: getLinkForRoadmapChild({ issueData: issueItem, currentRoadmapRoot: issueData })
        })
      }
    }
    return viewGroup
  }, [] as MutableDetailedViewGroup[])

  return reverse(Array.from(sortBy(group, ['groupName'])))
}
