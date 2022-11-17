import type {RoadmapMode} from './enums'

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
  errors?: StarMapsError[];
}

interface ParserGetChildrenResponse {
  html_url: string;
  group: string;
}

interface RoadmapProps {}

export interface StarMapsError {
  /**
   * The GitHub html_url for the issue with the error.
   */
  url: string;
  /**
   * The URL to the relevant section in the User Guide.md
   * Link to overall user-guide if error is not relevant to a specific section
   */
  userGuideUrl: string;
  /**
   * Friendly error title
   */
  title: string;
  /**
   * Descriptive error message
   */
  message: string;
}

export interface ServerSidePropsResult {
  props: {
    // roadmap: RoadmapApiResponse,
    issueData: IssueData | null,
    errors: StarMapsError[],
    isLocal: boolean,
    /**
     * Used via the filter_group query parameter to filter the roadmap by a specific group.
     */
    groupBy: string | null,
    error?: { code: string, message: string } | null;
    mode: RoadmapMode;
  }
}

export interface DetailedViewGroup {
  groupName: string;
  items: IssueData[];
  url: string;
}

export interface GroupItemProps {
  /**
   * The root node issue data; The GitHub issue URL provided in RoadmapForm, or
   * currently rendered root issue.
   */
  issueData: IssueData;
  group: DetailedViewGroup;
}

export { RoadmapApiResponse, IssueData, IssueStates, ParserGetChildrenResponse };
