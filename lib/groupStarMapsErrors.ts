import { groupBy, uniqBy } from 'lodash'

import { StarMapsError, StarMapsIssueError, StarMapsIssueErrorsGrouped } from './types'

export function groupStarMapsErrors (errors: StarMapsError[]): StarMapsIssueErrorsGrouped[] {
  const groupedErrors = groupBy(uniqBy(errors, (error) => `${error.issueUrl}${error.message}`), 'issueUrl')
  const processedErrors: StarMapsIssueErrorsGrouped[] = []
  for (const [url, errorsForUrl] of Object.entries(groupedErrors)) {
    const urlErrors: StarMapsIssueError[] = []
    errorsForUrl.forEach((starMapError) => {
      urlErrors.push({
        // errors:
        userGuideUrl: starMapError.userGuideUrl,
        title: starMapError.title,
        message: starMapError.message
      })
    })
    processedErrors.push({
      issueUrl: url,
      issueTitle: errorsForUrl[0].issueTitle,
      errors: urlErrors
    })
  }

  return processedErrors
}
