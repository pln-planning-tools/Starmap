import { paramsFromUrl } from '../paramsFromUrl';
import { IssueData } from '../types';

function getLinkForRoadmapChild(issueData?: IssueData): string {
  if (issueData == null || issueData?.children?.length === 0) {
    return '#';
  }
  const urlM = paramsFromUrl(issueData.html_url);
  return `/roadmap/github.com/${urlM.owner}/${urlM.repo}/issues/${urlM.issue_number}`;
}

export { getLinkForRoadmapChild };
