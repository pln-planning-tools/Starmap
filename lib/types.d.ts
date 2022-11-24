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

export interface GithubIssueDataWithGroupAndChildren extends GithubIssueDataWithGroup, GithubIssueDataWithChildren {
  pendingChildren?: PendingChildren[]
}

export type ParentIssueData = IssueData;

export interface IssueData extends GithubIssueDataWithGroupAndChildren {
  children: IssueData[];
  completion_rate: number;
  due_date: string;
  parent: ParentIssueData;
}

export interface RoadmapApiResponseSuccess {
  data: IssueData;
  errors?: StarMapsIssueErrorsGrouped[];
  pendingChildren: PendingChildren[];
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
export interface PendingChildren extends ParserGetChildrenResponse {
  parentHtmlUrl: string;
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


export interface RoadmapServerSidePropsResult {
  props: {
    error: { code: string; message: string } | null,
    owner: string;
    repo: string;
    issue_number: string;
    isLocal: boolean;

    groupBy: string | null,
    error?: { code: string, message: string } | null;
    mode: RoadmapMode;
    dateGranularity: DateGranularityState;
    pendingChildren?: ParserGetChildrenResponse[];
    baseUrl: string;
  }
}

export interface DetailedViewGroup {
  groupName: string;
  items: IssueData[];
  url: string;
}

export interface GroupHeaderProps {
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
