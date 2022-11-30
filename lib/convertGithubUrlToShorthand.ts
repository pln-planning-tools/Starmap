import { paramsFromUrl } from './paramsFromUrl';

export function convertGithubUrlToShorthand(url: URL): string {
  const { owner, repo, issue_number } = paramsFromUrl(url.toString());
  return `${owner}/${repo}#${issue_number}`;
}
