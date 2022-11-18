import {
  GithubIssueData,
  StarMapsError,
  StarMapsIssueError,
  StarMapsIssueErrorsGrouped
} from '../types';
import { groupBy } from 'lodash';

export class ErrorManager {
  errors: StarMapsError[];
  constructor() {
    this.errors = [];
  }

  private processStarMapsErrors(): StarMapsIssueErrorsGrouped[] {
    const groupedErrors = groupBy(this.errors, 'issueUrl');
    const processedErrors: StarMapsIssueErrorsGrouped[] = [];
    for (const [url, errorsForUrl] of Object.entries(groupedErrors)) {
      const urlErrors: StarMapsIssueError[] = []
      errorsForUrl.forEach((starMapError) => {
        urlErrors.push({
          // errors:
          userGuideUrl: starMapError.userGuideUrl,
          title: starMapError.title,
          message: starMapError.message,
        });

      });
      processedErrors.push({
        issueUrl: url,
        issueTitle: errorsForUrl[0].issueTitle,
        errors: urlErrors,
      });
    }

    return processedErrors;
  }

  addError({
    issue,
    errorTitle,
    errorMessage,
    userGuideSection
  }: {
    issue: GithubIssueData;
    errorTitle: string;
    errorMessage: string;
    userGuideSection: string;
  }): void {
    const { html_url, title } = issue;
    this.errors.push({
      issueUrl: html_url,
      issueTitle: title,
      userGuideUrl: `https://github.com/pln-planning-tools/Starmaps/blob/main/User%20Guide.md${userGuideSection}`,
      title: errorTitle,
      message: errorMessage
    });
  }

  flushErrors() {
    const errors = this.processStarMapsErrors();
    this.clearErrors();
    return errors;
  }

  clearErrors() {
    this.errors = [];
  }
}

export const errorManager = new ErrorManager();
