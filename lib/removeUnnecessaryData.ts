import { IssueData, PreParsedIssueData } from './types';

type PreParsedIssueData2 = Pick<
  IssueData,
  'html_url' | 'group' | 'children' | 'title' | 'state' | 'node_id' | 'labels' | 'completion_rate' | 'due_date' | 'parent'
>;
export function removeUnnecessaryData(preParsedIssueData: PreParsedIssueData2): IssueData {
  const issueData: IssueData = {
    html_url: preParsedIssueData.html_url,
    group: preParsedIssueData.group,
    title: preParsedIssueData.title,
    state: preParsedIssueData.state,
    node_id: preParsedIssueData.node_id,
    labels: preParsedIssueData.labels,
    completion_rate: preParsedIssueData.completion_rate,
    due_date: preParsedIssueData.due_date,
    children: preParsedIssueData.children.map((i) => removeUnnecessaryData(i)),
    parent: {
      html_url: preParsedIssueData.parent?.html_url,
      group: preParsedIssueData.parent?.group,
      title: preParsedIssueData.parent?.title,
      state: preParsedIssueData.parent?.state,
      node_id: preParsedIssueData.parent?.node_id,
      labels: preParsedIssueData.parent?.labels,
      completion_rate: preParsedIssueData.parent?.completion_rate,
      due_date: preParsedIssueData.parent?.due_date,
    },
  }

  return issueData;
}
