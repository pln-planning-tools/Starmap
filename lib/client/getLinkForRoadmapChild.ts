import { ImmutableObject } from '@hookstate/core'

import { appendCrumbArrayData, convertCrumbDataArraysToCrumbDataString, getCrumbDataArrayFromIssueData, routerQueryToCrumbArrayData } from '../breadcrumbs'
import { ViewMode } from '../enums'
import { paramsFromUrl } from '../paramsFromUrl'
import { IssueData, QueryParameters } from '../types'

type childrenAndUrl = Pick<IssueData, 'html_url' | 'children'>;
type parentAndChildren = Pick<IssueData, 'parent' | 'children'>;
type parentAndChildrenAndUrl = childrenAndUrl & Partial<parentAndChildren>;
interface GetLinkForRoadmapChildOptions {
  issueData?: ImmutableObject<parentAndChildrenAndUrl>;
  query?: QueryParameters;
  currentRoadmapRoot?: Pick<IssueData, 'html_url' | 'title'>;
  viewMode?: ViewMode;
  replaceOrigin?: boolean;
}

function addCrumbsParamToUrl ({ url, currentRoadmapRoot, query }: Pick<GetLinkForRoadmapChildOptions, 'currentRoadmapRoot' | 'query'> & {url: URL}) {
  if (currentRoadmapRoot != null) {
    const parentCrumbDataArray = getCrumbDataArrayFromIssueData(currentRoadmapRoot)
    let crumbDataArrays: [string, string][] = [parentCrumbDataArray]
    if (query != null) {
      const urlCrumbDataArray = routerQueryToCrumbArrayData(query)
      crumbDataArrays = appendCrumbArrayData(urlCrumbDataArray, parentCrumbDataArray)
    }

    url.searchParams.set('crumbs', convertCrumbDataArraysToCrumbDataString(crumbDataArrays))
  }
}

export function getLinkForRoadmapChild ({ issueData, currentRoadmapRoot, query, viewMode, replaceOrigin = true }: GetLinkForRoadmapChildOptions): string {
  if (issueData == null || issueData?.children?.length === 0 || issueData.html_url === '#') {
    return '#'
  }
  currentRoadmapRoot = currentRoadmapRoot ?? issueData.parent
  const urlM = paramsFromUrl(issueData.html_url)
  const url = new URL(`/roadmap/github.com/${urlM.owner}/${urlM.repo}/issues/${urlM.issue_number}`, window.location.origin)
  addCrumbsParamToUrl({ currentRoadmapRoot, query, url })
  if (viewMode != null) {
    url.hash = `view=${viewMode}`
  }

  if (!replaceOrigin) {
    return url.toString()
  }
  return url.toString().replace(window.location.origin, '')
}
