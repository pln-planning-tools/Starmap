enum IssueStates {
  Open = 'open',
  Closed = 'closed'
}
interface ListItem {
  childrenIssues: IssueData[]
  title: string
}

interface IssueData {
  html_url: string
  lists: ListItem[]
  node_id: string
  state: IssueStates
  title: string
  dueDate?: string
}

export {IssueData, IssueStates}
