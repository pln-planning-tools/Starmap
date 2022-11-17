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

export interface RoadmapApiResponseSuccess {
  data: IssueData;
  errors?: StarMapsIssueErrorsGrouped[];
}
export interface RoadmapApiResponseFailure {
  error?: { code: string; message: string };
  errors?: StarMapsIssueErrorsGrouped[];
}

export type RoadmapApiResponse = RoadmapApiResponseSuccess | RoadmapApiResponseFailure;

interface ParserGetChildrenResponse {
  html_url: string;
  group: string;
}

interface RoadmapProps {}

export interface StarMapsError {
  /**
   * The GitHub html_url for the issue with the error.
   */
  issueUrl: string;
  /**
   * The title of the github issue
   */
  issueTitle: string;
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
/**
 * This type is used when grouping multiple {StarMapsError} into a single error.
 */
export type StarMapsIssueError = Pick<StarMapsError, 'userGuideUrl'|'title'|'message'>

export interface StarMapsIssueErrorsGrouped {
  /**
   * The GitHub html_url for the issue with the error.
   */
  issueUrl: string;
  /**
   * The title of the github issue
   */
  issueTitle: string;
  errors: StarMapsIssueError[];
}


export interface ServerSidePropsResult {
  props: {
    issueData: IssueData | null,
    errors: StarMapsIssueErrorsGrouped[],
    error: { code: string; message: string } | null,
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

export { IssueData, IssueStates, ParserGetChildrenResponse };
