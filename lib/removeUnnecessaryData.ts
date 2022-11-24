import { IssueData } from './types';

export function removeUnnecessaryData(issueData: IssueData): IssueData {
  return {
    ...issueData,
    children: issueData.children.map((i) => removeUnnecessaryData(i)),
    body: '',
    body_html: '',
    body_text: '',
  }
}
