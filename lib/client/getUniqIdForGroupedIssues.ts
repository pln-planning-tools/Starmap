import { DetailedViewGroup, IssueData } from '../types';


interface GetUniqIdForGroupedIssuesArgs extends Omit<DetailedViewGroup, 'items'> {
  items: Pick<IssueData, 'node_id'>[]
}

// Based on Java's hashCode implementation: https://stackoverflow.com/a/7616484/104380
const hashCode = str => [...str].reduce((hash, chr) => 0 | (31 * hash + chr.charCodeAt(0)), 0)

export default function getUniqIdForGroupedIssues (groupedIssues: GetUniqIdForGroupedIssuesArgs[]): string {
  return groupedIssues.map((group) => {
    const groupChildrenId = group.items.map((item) => {
      try {
        return item.node_id;
      } catch (e) {
        console.error('Problem getting node_id for group item:', item)
        console.error(e)
        return hashCode(JSON.stringify(item));
      }
    }).join('-')
    return `${group.groupName}${groupChildrenId}`
  }).join('--')
}
