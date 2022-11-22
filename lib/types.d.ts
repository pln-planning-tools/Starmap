import type { RoadmapMode, IssueStates, DateGranularityState } from './enums'

export interface GithubIssueData {
  body_html: string;
  body_text: string;
  body: string;
  html_url: string;
  labels: string[];
  node_id: string;
  title: string;
  state: IssueStates;
  root_issue?: boolean;
}

export interface GithubIssueDataWithGroup extends GithubIssueData {
  group: string;
}

export interface GithubIssueDataWithChildren extends GithubIssueData {
  children: GithubIssueDataWithGroupAndChildren[];
}

export interface GithubIssueDataWithGroupAndChildren extends GithubIssueDataWithGroup, GithubIssueDataWithChildren {}

export interface IssueData extends GithubIssueDataWithGroupAndChildren {
  children: IssueData[];
  completion_rate: number;
  due_date: string;
  parent: IssueData;
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

export interface ParserGetChildrenResponse {
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
    dateGranularity: DateGranularityState;
  }
}

export interface DetailedViewGroup {
  groupName: string;
  items: IssueData[];
  url: string;
}

export interface GroupItemProps {
  group: DetailedViewGroup;
}

export interface UrlMatchSlugs {
  owner: string;
  repo: string;
  issue_number: string;
};

export interface QueryParameters {
  filter_group: string;
  mode: RoadmapMode;
  timeUnit: DateGranularityState;
}
