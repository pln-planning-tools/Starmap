enum IssueStates {
  Open = 'open',
  Closed = 'closed'
}
interface ListItem {
  children: IssueData[]
  title: string
}

interface IssueData {
  html_url: string
  children: ListItem[]
  node_id: string
  state: IssueStates
  title: string
  dueDate?: string
  parent_html_url?: string
  completion_rate: number
}

interface GithubIssueApiResponse {
  issueData: IssueData | null
  error: string | Error | null
}

export {
  GithubIssueApiResponse,
  IssueData,
  IssueStates,
}
