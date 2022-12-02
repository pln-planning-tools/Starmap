import { ErrorManager } from './errorManager';

/**
 * Check whether the issue exists, and has the correct label
 * @see https://github.com/pln-planning-tools/Starmaps/blob/main/User%20Guide.md#label-requirement
 * @param issue
 */
export function checkForLabel(issue, errorManager: ErrorManager) {
  const labels = issue?.labels || [];
  if (issue && !labels.includes('starmaps')) {
    errorManager.addError({
      issue,
      userGuideSection: '#label-requirement',
      errorTitle: 'Missing Label',
      errorMessage: 'Missing label `starmaps`',
    });
  }
}
