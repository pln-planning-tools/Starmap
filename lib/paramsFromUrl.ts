import { getValidUrlFromInput } from './getValidUrlFromInput';
import { slugsFromUrl } from './slugsFromUrl';
import { UrlMatchSlugs } from './types';

export function paramsFromUrl (urlString: string): UrlMatchSlugs | undefined {
  try {
    const urlObj = getValidUrlFromInput(urlString)
    const matchResult = slugsFromUrl(urlObj.pathname)
    if (matchResult !== false && matchResult.params != null) {
      return { ...matchResult.params };
    }
  } catch {
    throw new Error('Unsupported URL');
  }
};
