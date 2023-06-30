
export function regexIndexOf (string: string, regex: RegExp, startpos = 0) {
  const indexOf = string.substring(startpos).search(regex)
  if (indexOf >= 0) {
    return indexOf + startpos
  }
  return indexOf
}

export function indexOf (string: string, strOrRegex: string | RegExp, startpos = 0) {
  if (typeof strOrRegex === 'string') {
    return string.indexOf(strOrRegex, startpos)
  }
  return regexIndexOf(string, strOrRegex, startpos)
}

/**
 * This function accepts a string, and two regular expressions, and returns the
 * string between the two regular expressions.
 *
 * The returned string will not include the part of the original string matching
 * the regular expressions
 *
 * @throws {Error} If the first regular expression does not match the string
 * @throws {Error} If errorOnEndNotFound=true and the second regular expression
 * does not match the string
 */
export function betweenTwoRegex (str: string, regex1: RegExp, regex2: RegExp, errorOnEndNotFound = false): string {
  const result1 = regex1.exec(str)
  if (!result1) throw new Error(`Could not find '${regex1}' in string`)
  const startMatchStr = result1[0]
  const startIndex = result1.index + startMatchStr.length

  const result = str.substring(startIndex)

  // then, get the index of the second regex
  const index2 = regexIndexOf(result, regex2)

  if (index2 === -1) {
    if (errorOnEndNotFound) {
      throw new Error(`Could not find '${regex2}' in string`)
    }
    // return the substring from the first index to the end of the string
    return result
  }

  // return the substring from the first index to the second index
  return result.substring(0, index2)
}
