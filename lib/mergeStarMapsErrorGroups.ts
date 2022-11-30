import { flattenStarMapsErrorGroups } from './flattenStarMapsErrorGroups';
import { groupStarMapsErrors } from './groupStarMapsErrors';
import { StarMapsError, StarMapsIssueErrorsGrouped } from './types';

export function mergeStarMapsErrorGroups(errors1: StarMapsIssueErrorsGrouped[], errors2: StarMapsIssueErrorsGrouped[]) {
  const flattenedErrors: StarMapsError[] = [
    ...flattenStarMapsErrorGroups(errors1),
    ...flattenStarMapsErrorGroups(errors2),
  ]

  return groupStarMapsErrors(flattenedErrors);
}
