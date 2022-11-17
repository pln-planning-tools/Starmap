import { groupBy } from 'lodash';
import { StarMapsError, StarMapsIssueError, StarMapsIssueErrorsGrouped } from '../types';

export class ErrorManager {
  errors: StarMapsError[];
  constructor() {
    this.errors = [];
  }

  private processStarMapsErrors(): StarMapsIssueErrorsGrouped[] {
    const groupedErrors = groupBy(this.errors, 'url');
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
        url,
        errors: urlErrors,
      });
    }

    return processedErrors;
  }

  addError(error: StarMapsError) {
    this.errors.push(error);
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
