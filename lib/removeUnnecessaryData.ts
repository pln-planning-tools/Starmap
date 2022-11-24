import { omit } from 'lodash';
import { IssueData, ParentIssueData, PreParsedIssueData, PreParsedIssueDataParent } from './types';

export function removeUnnecessaryData(preParsedIssueData: PreParsedIssueData | IssueData): IssueData {
  // const issueData: IssueData = omit(preParsedIssueData, ['body', 'body_html', 'body_text']) as IssueData;
  // if ()
  // preParsedIssueData.body = '';
  // preParsedIssueData.body_html = '';
  // preParsedIssueData.body_text = '';
  // const preParsedParent: PreParsedIssueDataParent = ;
  // if (parent != null && parent.children?.length > 0) {
  //   // const parent = issueData.parent as PreParsedIssueData;
  //   parent.children.map((i) => removeUnnecessaryData(i))
  //   parent.children = [];
  // }

  // const parent: ParentIssueData =
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

  return issueData as IssueData;
}
