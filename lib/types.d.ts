enum IssueStates {
  Closed = 'closed',
  Open = 'open',
}

interface IssueData {
  body_html: string;
  body_text: string;
  body: string;
  children: IssueData[IssueData];
  completion_rate: number;
  due_date?: string;
  group: string;
  html_url: string;
  node_id: string;
  parent: IssueData[IssueData];
  state: IssueStates;
  title: string;
}

interface RoadmapApiResponse {
  data?: IssueData;
  error?: { code: string; message: string };
}

interface ParserGetChildrenResponse {
  html_url: string;
  group: string;
}

export { RoadmapApiResponse, IssueData, IssueStates, ParserGetChildrenResponse };
