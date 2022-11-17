import { paramsFromUrl } from '../paramsFromUrl';
import { IssueData } from '../types';

function getLinkForRoadmapChild(issueData: IssueData): string {
  const urlM = paramsFromUrl(issueData.html_url)
  // const { id, type } = roadmapChild;
  // const link = `${window.location.origin}/roadmap/${type}/${id}`;
  return `/roadmap/github.com/${urlM.owner}/${urlM.repo}/issues/${urlM.issue_number}`;
}

export { getLinkForRoadmapChild };
