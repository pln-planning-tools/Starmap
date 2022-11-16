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

interface RoadmapApiResponse {
  data?: IssueData;
  error?: { code: string; message: string };
}

interface ParserGetChildrenResponse {
  html_url: string;
  group: string;
}

interface RoadmapProps {}

export interface DetailedViewGroup {
  groupName: string;
  items: IssueData[];
  url: string;
}

export interface GroupItemProps {
  showGroupRowTitle: boolean;
  /**
   * The root node issue data; The GitHub issue URL provided in RoadmapForm, or
   * currently rendered root issue.
   */
  issueData: IssueData;
  group: DetailedViewGroup;
}

export { RoadmapApiResponse, IssueData, IssueStates, ParserGetChildrenResponse };
