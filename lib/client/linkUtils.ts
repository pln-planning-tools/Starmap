import { slugsFromUrl } from '../../utils/general';
import { IssueData } from '../types';

function getLinkForRoadmapChild(issueData: IssueData): string {
  const urlM = slugsFromUrl(new URL(issueData.html_url).pathname) as {
    params: { owner: string; repo: string; issue_number: string };
  };
  // const { id, type } = roadmapChild;
  // const link = `${window.location.origin}/roadmap/${type}/${id}`;
  return `/roadmap/github.com/${urlM.params.owner}/${urlM.params.repo}/issues/${urlM.params.issue_number}`;
}

export { getLinkForRoadmapChild };
