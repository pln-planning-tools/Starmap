import { convertGithubUrlToShorthand } from './convertGithubUrlToShorthand';
import { ViewMode } from './enums';
import { getValidUrlFromInput } from './getValidUrlFromInput';
import { paramsFromUrl } from './paramsFromUrl';
import { IssueData } from './types';

interface CrumbData {
  url: string;
  title: string;
}

export function getCrumbStringFromIssueData({ html_url, title }: Pick<IssueData, 'html_url' | 'title'>): string {
  return JSON.stringify(getCrumbDataArrayFromIssueData({ html_url, title }));
}
export function getCrumbDataArrayFromIssueData({ html_url, title }: Pick<IssueData, 'html_url' | 'title'>): [string, string] {
  return [convertGithubUrlToShorthand(new URL(html_url)), title];
}

export function convertCrumbDataArraysToCrumbDataString(crumbDataArrays: [string, string][]): string {
  return JSON.stringify([...crumbDataArrays]);
}

function mapCrumbArrayToCrumbData(crumbItem, index, crumbArray) {
  const [shortGithubId, title] = crumbItem;
  const { owner, repo, issue_number } = paramsFromUrl(getValidUrlFromInput(shortGithubId).toString());
  const url = new URL(`/roadmap/github.com/${owner}/${repo}/issues/${issue_number}`, window.location.origin);
  const crumbParents = crumbArray.slice(0, index);

  if (crumbParents.length > 0) {
    const crumbsForUrl = convertCrumbDataArraysToCrumbDataString([ ...crumbParents]);

    url.searchParams.append('crumbs', crumbsForUrl)
  }

  return {
    url,
    title,
  };
}

/**
 *
 * @param crumbs A JSON.stringified representation of crumbs like that returned by convertCrumbDataArraysToCrumbDataString
 * @param viewMode the current view mode, to ensure links stay in the current view
 * @returns
 */
export function getCrumbDataFromCrumbString(crumbs: string, viewMode: ViewMode): CrumbData[] {
  const crumbItems = JSON.parse(crumbs) as [string, string][];

  const crumbData: CrumbData[] = crumbItems.map(mapCrumbArrayToCrumbData).map((crumb) => {
    crumb.url.hash = viewMode;
    return {
      ...crumb,
      url: crumb.url.toString()
    };
  });

  return crumbData;
}
