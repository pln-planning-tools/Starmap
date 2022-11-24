import { getDueDate } from '../parser';
import { removeUnnecessaryData } from '../removeUnnecessaryData';
import { GithubIssueDataWithGroupAndChildren, IssueData, ParentIssueData } from '../types';
import { calculateCompletionRate } from './calculateCompletionRate';

const convertToIssueData = (item: GithubIssueDataWithGroupAndChildren, parent: IssueData): Omit<IssueData, 'children'> & {children: GithubIssueDataWithGroupAndChildren[]} => ({
  labels: item.labels ?? [],
  completion_rate: calculateCompletionRate(item),
  due_date: getDueDate(item).eta,
  html_url: item.html_url,
  group: parent.title,
  title: item.title,
  state: item.state,
  node_id: item.node_id,
  body: '', // item.body,
  body_html: '', //item.body_html,
  body_text: '', //item.body_text,
  parent: {
    // reduce the duplication and size of response
    ...parent as ParentIssueData,
    children: [], // we do not need children in the parent
    body: '',
    body_html: '',
    body_text: '',
  },
  children: item.children as GithubIssueDataWithGroupAndChildren[],
})

export function addToChildren(
  data: GithubIssueDataWithGroupAndChildren[],
  parent: IssueData | GithubIssueDataWithGroupAndChildren
): IssueData[] {
  if (Array.isArray(data)) {
    return data.map((item) => {
      const issueData = convertToIssueData(item, parent as IssueData);
      return removeUnnecessaryData({
        ...issueData,
        children: addToChildren(item.children, item)
      })
    });
  }

  return [];
};
