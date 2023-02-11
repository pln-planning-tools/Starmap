import { DetailedViewGroup, IssueData } from '../types';


interface GetUniqIdForGroupedIssuesArgs extends Omit<DetailedViewGroup, 'items'> {
  items: Pick<IssueData, 'node_id'>[]
}

export default function getUniqIdForGroupedIssues (groupedIssues: GetUniqIdForGroupedIssuesArgs[]): string {
  return groupedIssues.map((group) => {
    const groupChildrenId = group.items.map((item) => {
      try {
        return item.node_id;
      } catch (e) {
        console.error('Problem getting node_id for group item:', item)
        console.error(e)
        return Date.now().toString() + Math.random().toString()
      }
    }).join('-')
    return `${group.groupName}${groupChildrenId}`
  }).join('--')
}
