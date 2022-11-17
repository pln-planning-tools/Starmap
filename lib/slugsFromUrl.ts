import { match, MatchResult } from 'path-to-regexp';

import { UrlMatchSlugs } from './types';

export const slugsFromUrl = (url: string): MatchResult<UrlMatchSlugs> | false => {
  const matchResult = match<UrlMatchSlugs>('/:owner/:repo/issues/:issue_number(\\d+)', {
    decode: decodeURIComponent,
  })(url);

  return matchResult;
};
