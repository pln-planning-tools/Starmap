enum IssueStates {
  Closed = 'closed',
  Open = 'open',
}

interface IssueData {
  body_html: string;
  body_text: string;
  body: string;
  children: IssueData[];
  completion_rate: number;
  due_date: string;
  group: string;
  html_url: string;
  node_id: string;
  parent: IssueData;
  state: IssueStates;
  title: string;
}

interface IssueDataGrouped {
  groupName: string;
  items: IssueData[];
}

interface RoadmapApiResponse {
  data?: IssueData;
  error?: { code: string; message: string };
}

interface RoadmapApiQueryParameters {
  platform?: string;
  owner: string;
  repo: string;
  issue_number: number;
}

interface ParserGetChildrenResponse {
  html_url: string;
  group: string;
}

interface RoadmapProps {}

export {
  RoadmapApiQueryParameters,
  RoadmapApiResponse,
  IssueData,
  IssueStates,
  ParserGetChildrenResponse,
  IssueDataGrouped,
};
