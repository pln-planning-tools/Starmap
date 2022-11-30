import { paramsFromUrl } from '../paramsFromUrl';
import { IssueData } from '../types';
import { convertGithubUrlToShorthand } from '../convertGithubUrlToShorthand';

function getLinkForRoadmapChild(issueData?: IssueData, query?: {crumbs?: string}): string {
  if (issueData == null || issueData?.children?.length === 0) {
    return '#';
  }
  const urlM = paramsFromUrl(issueData.html_url);
  const url = new URL(`/roadmap/github.com/${urlM.owner}/${urlM.repo}/issues/${urlM.issue_number}`, window.location.origin);
  const crumbForParent = `${convertGithubUrlToShorthand(new URL(issueData.parent.html_url))}@@${issueData.parent.title}`;
  let crumbString = crumbForParent;
  if (query?.crumbs != null) {
    const crumbPieces = decodeURIComponent(query.crumbs).split(',');
    crumbString = crumbPieces.concat(crumbForParent).join(',');
  }
  url.searchParams.set('crumbs', encodeURIComponent(crumbString));

  return url.toString().replace(window.location.origin, '');
}

export { getLinkForRoadmapChild };
