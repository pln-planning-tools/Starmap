import { paramsFromUrl } from '../paramsFromUrl';
import { IssueData } from '../types';
import { convertCrumbDataArraysToCrumbDataString, getCrumbDataArrayFromIssueData } from '../breadcrumbs';
import { ViewMode } from '../enums';

interface GetLinkForRoadmapChildOptions {
  issueData?: Pick<IssueData, 'html_url' | 'children'> & Partial<Pick<IssueData, 'children' | 'parent'>>;
  query?: {crumbs?: string};
  currentRoadmapRoot?: Pick<IssueData, 'html_url' | 'title'>;
  viewMode?: ViewMode;
  replaceOrigin?: boolean;
}

function addCrumbsParamToUrl({ url, currentRoadmapRoot, query }: Pick<GetLinkForRoadmapChildOptions, 'currentRoadmapRoot' | 'query'> & {url: URL}) {
  if (currentRoadmapRoot != null) {
    const parentCrumbDataArray = getCrumbDataArrayFromIssueData(currentRoadmapRoot);
    const crumbShortIdSet = new Set();
    let crumbDataArrays: [string, string][] = [parentCrumbDataArray];
    if (query?.crumbs != null) {
      const urlCrumbDataArray = JSON.parse(decodeURIComponent(query.crumbs));
      urlCrumbDataArray.forEach((crumbDataArray) => crumbShortIdSet.add(crumbDataArray[0]));
      // prevent duplicates
      if (crumbShortIdSet.has(parentCrumbDataArray[0])) {
        crumbDataArrays = urlCrumbDataArray;
      } else {
        // parent hasn't been added, so we're going to add it to the existing array.
        crumbDataArrays = urlCrumbDataArray.concat([parentCrumbDataArray]);
      }
    }

    url.searchParams.set('crumbs', convertCrumbDataArraysToCrumbDataString(crumbDataArrays));
  }
}

export function getLinkForRoadmapChild({ issueData, currentRoadmapRoot, query, viewMode, replaceOrigin = true }: GetLinkForRoadmapChildOptions): string {
  if (issueData == null || issueData?.children?.length === 0 || issueData.html_url === '#') {
    return '#';
  }
  currentRoadmapRoot = currentRoadmapRoot ?? issueData.parent;
  const urlM = paramsFromUrl(issueData.html_url);
  const url = new URL(`/roadmap/github.com/${urlM.owner}/${urlM.repo}/issues/${urlM.issue_number}`, window.location.origin);
  addCrumbsParamToUrl({ currentRoadmapRoot, query, url });
  if (viewMode != null) {
    url.hash = viewMode;
  }


  if (!replaceOrigin) {
    return url.toString()
  }
  return url.toString().replace(window.location.origin, '');
}
