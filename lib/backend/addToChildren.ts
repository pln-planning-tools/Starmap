import { getDueDate } from '../parser';
import { removeUnnecessaryData } from '../removeUnnecessaryData';
import { GithubIssueDataWithGroupAndChildren, IssueData } from '../types';
import { calculateCompletionRate } from './calculateCompletionRate';

export function addToChildren(
  data: GithubIssueDataWithGroupAndChildren[],
  parent: IssueData | GithubIssueDataWithGroupAndChildren
): IssueData[] {
  if (Array.isArray(data)) {
    return data.map((item: GithubIssueDataWithGroupAndChildren): IssueData => removeUnnecessaryData({
      labels: item.labels ?? [],
      completion_rate: calculateCompletionRate(item),
      due_date: getDueDate(item).eta,
      html_url: item.html_url,
      group: item.group,
      title: item.title,
      state: item.state,
      node_id: item.node_id,
      body: item.body,
      body_html: item.body_html,
      body_text: item.body_text,
      parent: {
        ...parent as IssueData,
        children: [], // we don't need children in the parent
      },
      children: addToChildren(item.children, item),
    }));
  }

  return [];
};
