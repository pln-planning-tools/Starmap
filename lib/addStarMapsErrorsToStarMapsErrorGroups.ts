import { flattenStarMapsErrorGroups } from './flattenStarMapsErrorGroups'
import { groupStarMapsErrors } from './groupStarMapsErrors'
import { StarMapsError, StarMapsIssueErrorsGrouped } from './types'

export function addStarMapsErrorsToStarMapsErrorGroups (errors: StarMapsError[], errorGroups: StarMapsIssueErrorsGrouped[]) {
  return groupStarMapsErrors([...errors, ...flattenStarMapsErrorGroups(errorGroups)])
}
