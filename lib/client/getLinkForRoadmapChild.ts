import { paramsFromUrl } from '../paramsFromUrl';
import { IssueData } from '../types';
import { getCrumbStringFromIssueData } from '../breadcrumbs';

interface GetLinkForRoadmapChildOptions {
  issueData?: IssueData;
  query?: {crumbs?: string};
  currentRoadmapRoot?: Pick<IssueData, 'html_url' | 'title'>;
}

function addCrumbsParamToUrl({ url, currentRoadmapRoot, query }: Pick<GetLinkForRoadmapChildOptions, 'currentRoadmapRoot' | 'query'> & {url: URL}) {
  if (currentRoadmapRoot != null) {
    const crumbForParent = getCrumbStringFromIssueData(currentRoadmapRoot);
    let crumbString = crumbForParent;
    if (query?.crumbs != null) {
      const crumbPieces = decodeURIComponent(query.crumbs).split(',');
      crumbString = crumbPieces.concat(crumbForParent).join(',');
    }
    url.searchParams.set('crumbs', crumbString);
  }
}

export function getLinkForRoadmapChild({ issueData, currentRoadmapRoot, query }: GetLinkForRoadmapChildOptions): string {
  if (issueData == null || issueData?.children?.length === 0) {
    return '#';
  }
  currentRoadmapRoot = currentRoadmapRoot ?? issueData.parent;
  const urlM = paramsFromUrl(issueData.html_url);
  const url = new URL(`/roadmap/github.com/${urlM.owner}/${urlM.repo}/issues/${urlM.issue_number}`, window.location.origin);
  addCrumbsParamToUrl({ currentRoadmapRoot, query, url });

  return url.toString().replace(window.location.origin, '');
}
