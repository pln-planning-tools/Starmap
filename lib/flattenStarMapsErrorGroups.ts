import { StarMapsError, StarMapsIssueErrorsGrouped } from './types'

export function flattenStarMapsErrorGroups (errors: StarMapsIssueErrorsGrouped[]): StarMapsError[] {
  return errors.flatMap(({ issueUrl, issueTitle, errors }) => errors.map(({ userGuideUrl, title, message }) => ({ issueUrl, issueTitle, userGuideUrl, title, message })))
}
