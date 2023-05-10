import { convertGithubUrlToShorthand } from './convertGithubUrlToShorthand';
import { ViewMode } from './enums';
import { getValidUrlFromInput } from './getValidUrlFromInput';
import { paramsFromUrl } from './paramsFromUrl';
import { IssueData, QueryParameters } from './types';

interface CrumbData {
  url: string;
  title: string;
}
type CrumbArrayData = [string, string]

export function getCrumbStringFromIssueData({ html_url, title }: Pick<IssueData, 'html_url' | 'title'>): string {
  return JSON.stringify(getCrumbDataArrayFromIssueData({ html_url, title }));
}

export function getCrumbDataArrayFromIssueData({ html_url, title }: Pick<IssueData, 'html_url' | 'title'>): CrumbArrayData {
  return [convertGithubUrlToShorthand(new URL(html_url)), title];
}

export function convertCrumbDataArraysToCrumbDataString(crumbDataArrays: CrumbArrayData[]): string {
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

export function getCrumbDataArrayFromCrumbString(crumbString: string): CrumbArrayData[] {
  try {
    return JSON.parse(crumbString);
  } catch (err) {
    console.error(`Error parsing crumb string "${crumbString}"`, err);
    return [];
  }
}

export function routerQueryToCrumbArrayData({ crumbs }: QueryParameters): CrumbArrayData[] {
  if (crumbs == null) {
    return [];
  }
  return getCrumbDataArrayFromCrumbString(decodeURIComponent(crumbs));//.map(mapCrumbArrayToCrumbData);
}

export function appendCrumbArrayData(urlCrumbDataArray: CrumbArrayData[], parentCrumbDataArray: CrumbArrayData): CrumbArrayData[] {
  const crumbShortIdSet = new Set();
  urlCrumbDataArray.forEach((crumbDataArray) => crumbShortIdSet.add(crumbDataArray[0]));
  let crumbDataArrays: CrumbArrayData[] = urlCrumbDataArray;
  // prevent duplicates
  if (crumbShortIdSet.has(parentCrumbDataArray[0])) {
    crumbDataArrays = urlCrumbDataArray;
  } else {
    // parent hasn't been added, so we're going to add it to the existing array.
    crumbDataArrays = urlCrumbDataArray.concat([parentCrumbDataArray]);
  }
  return crumbDataArrays;
}

export function getCrumbDataFromCrumbDataArray(crumbItems: CrumbArrayData[], viewMode: ViewMode): CrumbData[] {
  return crumbItems.map(mapCrumbArrayToCrumbData).map((crumb) => {
    crumb.url.hash = `view=${viewMode}`;
    return {
      ...crumb,
      url: crumb.url.toString()
    };
  });
}

/**
 *
 * @param crumbs A JSON.stringified representation of crumbs like that returned by convertCrumbDataArraysToCrumbDataString
 * @param viewMode the current view mode, to ensure links stay in the current view
 * @returns
 */
export function getCrumbDataFromCrumbString(crumbs: string, viewMode: ViewMode): CrumbData[] {
  const crumbItems = getCrumbDataArrayFromCrumbString(crumbs);

  return getCrumbDataFromCrumbDataArray(crumbItems, viewMode);
}
