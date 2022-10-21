enum IssueStates {
  Closed = 'closed',
  Open = 'open',
}

interface IssueData {
  children: IssueData[IssueData];
  completion_rate: number;
  due_date?: string;
  html_url: string;
  node_id: string;
  parent: IssueData[IssueData];
  state: IssueStates;
  title: string;
}

interface GithubIssueApiResponse {
  error: string | null;
  issueData: IssueData | null;
}

export { GithubIssueApiResponse, IssueData, IssueStates };
