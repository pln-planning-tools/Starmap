enum IssueStates {
  Open = 'open',
  Closed = 'closed',
}

interface IssueData {
  html_url: string;
  children: IssueData[IssueData];
  node_id: string;
  state: IssueStates;
  title: string;
  dueDate?: string;
  parent_html_url?: string;
  completion_rate: number;
}

interface GithubIssueApiResponse {
  issueData: IssueData | null;
  error: string | null;
}

export { GithubIssueApiResponse, IssueData, IssueStates };
