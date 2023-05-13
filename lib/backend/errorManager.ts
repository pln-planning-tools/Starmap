import { groupStarMapsErrors } from '../groupStarMapsErrors'
import {
  GithubIssueData,
  StarMapsError
} from '../types'

export class ErrorManager {
  errors: StarMapsError[]
  constructor () {
    this.errors = []
  }

  addError ({
    issue,
    errorTitle,
    errorMessage,
    userGuideSection
  }: {
    issue: Pick<GithubIssueData, 'html_url' | 'title'>;
    errorTitle: string;
    errorMessage: string;
    userGuideSection: string;
  }): void {
    const { html_url, title } = issue
    this.errors.push({
      issueUrl: html_url,
      issueTitle: title,
      userGuideUrl: `https://github.com/pln-planning-tools/Starmap/blob/main/User%20Guide.md${userGuideSection}`,
      title: errorTitle,
      message: errorMessage
    })
  }

  flushErrors () {
    const errors = groupStarMapsErrors(this.errors)
    this.clearErrors()
    return errors
  }

  clearErrors () {
    this.errors = []
  }
}
