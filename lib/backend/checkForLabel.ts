import { errorManager } from './errorManager';

/**
 * Check whether the issue exists, and has the correct label
 * @see https://github.com/pln-planning-tools/Starmaps/blob/main/User%20Guide.md#label-requirement
 * @param issue
 */
export function checkForLabel(issue) {
  const labels = issue?.labels || [];
  if (issue && !labels.includes('starmaps')) {
      errorManager.addError({
        issueUrl: issue.html_url,
        issueTitle: issue.title,
        message: 'Missing label `starmaps`',
        title: 'Missing Label',
        userGuideUrl: 'https://github.com/pln-planning-tools/Starmaps/blob/main/User%20Guide.md#label-requirement',
      })
    }
}
