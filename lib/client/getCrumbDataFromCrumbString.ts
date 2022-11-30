import { ViewMode } from '../enums';
import { getValidUrlFromInput } from '../getValidUrlFromInput';
import { paramsFromUrl } from '../paramsFromUrl';

interface CrumbData {
  url: null | string;
  title: string;
}

export function getCrumbDataFromCrumbString(crumbs: string, viewMode: ViewMode): CrumbData[] {
  const crumbItems = decodeURIComponent(crumbs).split(',');
  const crumbData: CrumbData[] = [];
  crumbItems.forEach((crumb, index) => {
    const crumbParts = crumb.split('@@');
    const { owner, repo, issue_number } = paramsFromUrl(getValidUrlFromInput(crumbParts[0]).toString());
    const url = new URL(`/roadmap/github.com/${owner}/${repo}/issues/${issue_number}#${viewMode}`, window.location.origin);
    const crumbsForUrl = encodeURIComponent(crumbItems.slice(0, index).join(','));

    if (crumbsForUrl.length > 0) {
      url.searchParams.append('crumbs', crumbsForUrl)
    }

    crumbData.push({
      url: url.toString(),
      title: crumbParts[1],
    });
  });

  return crumbData;
}
