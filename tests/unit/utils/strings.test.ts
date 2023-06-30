import { betweenTwoRegex, regexIndexOf } from '../../../lib/utils/strings'

describe('strings', function () {
  describe('regexIndexOf', function () {
    it('returns -1 if the regex is not found', function () {
      const str = 'hello world'
      const regex = /goodbye/
      const result = regexIndexOf(str, regex)
      expect(result).toBe(-1)
    })

    it('returns the index of the regex if it is found', function () {
      const str = 'hello world'
      const regex = /world/
      const result = regexIndexOf(str, regex)
      expect(result).toBe(6)
    })

    it('returns the index of the regex if it is found, with a startpos', function () {
      const str = 'hello world'

      expect(regexIndexOf(str, /hello/, 1)).toBe(-1)
      expect(regexIndexOf(str, /world/, 1)).toBe(6)
    })
  })

  describe('betweenTwoRegex', function () {
    it('works on single lines', function () {
      const str = 'hello1111world'
      const regex1 = /hello/
      const regex2 = /world/
      const result = betweenTwoRegex(str, regex1, regex2)
      expect(result).toBe('1111')
    })

    it('works on multiple lines', function () {
      const str = 'hello1111\nworld'
      const regex1 = /hello/
      const regex2 = /world/
      const result = betweenTwoRegex(str, regex1, regex2)
      expect(result).toBe('1111\n')
    })

    it('works on complicated multiple line strings', function () {
      const str = 'eta: 2023Q4\r\n\r\n```[tasklist]\r\n### Tasks\r\n- [ ] #121\r\n- [ ] #122\r\n- [ ] #123\r\n- [ ] #124\r\n```\r\n'
      const regex1 = /^```\[tasklist\][\r\n]+/gm
      const regex2 = /^```$/gm
      const result = betweenTwoRegex(str, regex1, regex2)
      expect(result).toBe('### Tasks\r\n- [ ] #121\r\n- [ ] #122\r\n- [ ] #123\r\n- [ ] #124\r\n')
    })

    it('throws an error if the first regex is not found', function () {
      const str = 'hello1111\nworld'
      const regex1 = /goodbye/
      const regex2 = /world/
      expect(() => betweenTwoRegex(str, regex1, regex2)).toThrowError()
    })

    it('throws an error if the second regex is not found and errorOnEndNotFound=true', function () {
      const str = 'hello1111\r\nworld'
      const regex1 = /hello/
      const regex2 = /goodbye/
      expect(() => betweenTwoRegex(str, regex1, regex2, true)).toThrowError()
    })

    it('does not throw an error if the second regex is not found and errorOnEndNotFound=false', function () {
      const str = 'hello1111\nworld'
      const regex1 = /hello/
      const regex2 = /goodbye/
      const result = betweenTwoRegex(str, regex1, regex2, false)
      expect(result).toBe('1111\nworld')
    })
  })
})
