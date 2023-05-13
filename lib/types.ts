import type { ImmutableArray, ImmutableObject } from '@hookstate/core'

import type { RoadmapMode, IssueStates, DateGranularityState } from './enums'

export interface GithubIssueData {
  body_html: string;
  body: string;
  html_url: string;
  labels: string[];
  node_id: string;
  title: string;
  state: IssueStates;
  root_issue?: boolean;
  description: string;
}

export interface GithubIssueDataWithGroup extends GithubIssueData {
  group: string;
}

export interface GithubIssueDataWithChildren extends GithubIssueData {
  // eslint-disable-next-line no-use-before-define
  children: GithubIssueDataWithGroupAndChildren[];
}

export interface GithubIssueDataWithGroupAndChildren extends GithubIssueDataWithGroup, GithubIssueDataWithChildren {
  // eslint-disable-next-line no-use-before-define
  pendingChildren?: PendingChildren[]
}
interface ProcessedGithubIssueDataWithGroupAndChildren extends Omit<GithubIssueDataWithGroupAndChildren, 'body' | 'body_html' | 'body_text' | 'children'> {
  children: ProcessedGithubIssueDataWithGroupAndChildren[];
}

interface PostParsedIssueData extends ProcessedGithubIssueDataWithGroupAndChildren {
  // eslint-disable-next-line no-use-before-define
  children: (PreParsedIssueData | IssueData)[];
  // eslint-disable-next-line no-use-before-define
  parent: PreParsedIssueData;
}

// type PostParsedIssueData = PreParsedIssueData;
interface PreParsedIssueData extends ProcessedGithubIssueDataWithGroupAndChildren {
  // eslint-disable-next-line no-use-before-define
  children: (PreParsedIssueData | IssueData)[];
  completion_rate: number;
  due_date: string;
  parent: PreParsedIssueData;
}
// type ProcessedParentIssueData = Omit<PreParsedIssueData, 'children' | 'parent'>;

export interface IssueData extends Omit<PostParsedIssueData, 'children' | 'parent'> {
  children: IssueData[];
  completion_rate: number;
  due_date: string;
  parent: Omit<IssueData, 'children' | 'parent'>;
  description: string;
}

export interface RoadmapApiResponseSuccess {
  data: IssueData;
  // eslint-disable-next-line no-use-before-define
  errors: StarMapsIssueErrorsGrouped[];
  // eslint-disable-next-line no-use-before-define
  pendingChildren: PendingChildren[];
}

export interface RoadmapApiResponseFailure {
  error?: { code: string; message: string };
  // eslint-disable-next-line no-use-before-define
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
  items: ImmutableArray<IssueData>;
  url: string;
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

export type BrowserMetricsProvider = typeof import('@ipfs-shipyard/ignite-metrics').BrowserMetricsProvider

interface StarmapContentUpdatedEvent extends Event {
  detail: {
    cacheName: string;
    updatedURL: string;
  }
}

export type BinPackIssueData = Pick<IssueData, 'due_date' | 'children' | 'html_url' | 'title' | 'completion_rate'>

export interface BinPackItem {
  top: number, // y1
  bottom: number, // y2
  left: number, // x1
  right: number, // x2
  data: ImmutableObject<BinPackIssueData>
}

export type BinPackedGroup = Omit<DetailedViewGroup, 'items'> & {items: BinPackItem[]}

declare global {
  interface DocumentEventMap {
    'starmap:content:updated': StarmapContentUpdatedEvent;
  }
}
