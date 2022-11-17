export function getValidUrlFromInput(urlString: string): URL {
  if (urlString.includes('#')) {
    urlString = urlString.replace('#', '/issues/')
  } else if (!urlString.includes('issues')) {
    throw new Error('Unsupported URL string. URLs should be formatted like a github issue')
  }
  /**
   * Cannot construct a URL from the given string.
   */
  if (urlString.includes('http')) {
    try {
      return new URL(urlString)
    } catch {}
  }
  if (urlString.includes('github.com')) {
    try {
      return new URL(`https://${urlString}`)
    } catch {}
  }

  return new URL(urlString, 'https://github.com')
};
