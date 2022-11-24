import { omit } from 'lodash';
import { getDueDate } from '../parser';
import { removeUnnecessaryData } from '../removeUnnecessaryData';
// import { removeUnnecessaryData } from '../removeUnnecessaryData';
import { GithubIssueDataWithGroupAndChildren, IssueData, ParentIssueData, PostParsedGithubIssueDataWithGroupAndChildren } from '../types';
import { calculateCompletionRate } from './calculateCompletionRate';

export function addToChildren(
  data: GithubIssueDataWithGroupAndChildren[],
  parent: IssueData | PostParsedGithubIssueDataWithGroupAndChildren = {} as IssueData | PostParsedGithubIssueDataWithGroupAndChildren
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
      // body: '',
      // body_html: '',
      // body_text: '',
      parent: /*parent as IssueData,*/ {
        // we don't need parents or children in an issue's parent
        ...omit(parent, ['children', 'parent']) as ParentIssueData,
        // children: [],
      },// */
      children: addToChildren(item.children, item),
    }));
  }

  return [];
};
