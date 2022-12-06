import { DetailedViewGroup, IssueData } from '../types';


interface GetUniqIdForGroupedIssuesArgs extends Omit<DetailedViewGroup, 'items'> {
  items: Pick<IssueData, 'node_id'>[]
}
export default function getUniqIdForGroupedIssues (groupedIssues: GetUniqIdForGroupedIssuesArgs[]): string {
  return groupedIssues.map((group) => {
    const groupChildrenId = group.items.map(({ node_id }) => node_id).join('-')
    return `${group.groupName}${groupChildrenId}`
  }).join('--')
}
