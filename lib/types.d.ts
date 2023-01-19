import type { State } from '@hookstate/core'

import type { RoadmapMode, IssueStates, DateGranularityState } from './enums'

export interface GithubIssueData {
  body_html: string;
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
interface ProcessedGithubIssueDataWithGroupAndChildren extends Omit<GithubIssueDataWithGroupAndChildren, 'body' | 'body_html' | 'body_text' | 'children'> {
  children: ProcessedGithubIssueDataWithGroupAndChildren[];
}

interface PreParsedIssueData extends ProcessedGithubIssueDataWithGroupAndChildren {
  children: (PreParsedIssueData | IssueData)[];
  parent: PreParsedIssueData;
}

type PostParsedIssueData = PreParsedIssueData;
type ProcessedParentIssueData = Omit<PreParsedIssueData, 'children' | 'parent'>;
interface PreParsedIssueData extends ProcessedGithubIssueDataWithGroupAndChildren {
  children: (PreParsedIssueData | IssueData)[];
  completion_rate: number;
  due_date: string;
  parent: PreParsedIssueData;
}

export interface IssueData extends  Omit<PostParsedIssueData, 'children' | 'parent'> {
  children: IssueData[];
  completion_rate: number;
  due_date: string;
  parent: Omit<IssueData, 'children' | 'parent'>;
}

export interface RoadmapApiResponseSuccess {
  data: IssueData;
  errors: StarMapsIssueErrorsGrouped[];
  pendingChildren: PendingChildren[];
}

export interface RoadmapApiResponseFailure {
  error?: { code: string; message: string };
  errors?: StarMapsIssueErrorsGrouped[];
}

export type RoadmapApiResponse = RoadmapApiResponseSuccess | RoadmapApiResponseFailure;
export type PendingChildApiResponseSuccess = Required<Omit<RoadmapApiResponseSuccess, 'pendingChildren'>>;
export type PendingChildApiResponseFailure = Pick<RoadmapApiResponseFailure, 'error'>;
export type PendingChildApiResponse = PendingChildApiResponseSuccess | PendingChildApiResponseFailure;

export interface ParserGetChildrenResponse {
  html_url: string;
  group: string;
}
export interface PendingChildren extends ParserGetChildrenResponse {
  parentHtmlUrl: string;
}

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

export interface GroupHeaderProps extends IssueDataViewInput {
  group: State<DetailedViewGroup>;
}

export interface UrlMatchSlugs {
  owner: string;
  repo: string;
  issue_number: string;
}

export interface QueryParameters {
  filter_group?: string;
  mode?: RoadmapMode;
  timeUnit?: DateGranularityState;
  crumbs?: string;
}

export interface IssueDataViewInput {
  issueDataState: State<IssueData>;
  // isRootIssueLoading: boolean;
  // isPendingChildrenLoading: boolean;
}

export type BrowserMetricsProvider = import('@ipfs-shipyard/ignite-metrics').BrowserMetricsProvider
