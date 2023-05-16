import { getValidUrlFromInput } from '../../lib/getValidUrlFromInput';

const expectedUrlObj = new URL('https://github.com/pln-planning-tools/Starmaps/issues/1')
describe('getValidUrlFromInput', function() {
  [
    'https://github.com/pln-planning-tools/Starmaps/issues/1',
    'github.com/pln-planning-tools/Starmaps/issues/1',
    'github.com/pln-planning-tools/Starmaps#1',
    'pln-planning-tools/Starmaps/issues/1',
    'pln-planning-tools/Starmaps#1',
  ].forEach((urlString) => {
    it(`should return a URL object for ${urlString}`, () => {
      expect(getValidUrlFromInput(urlString)).toEqual(expectedUrlObj);
    });
  })

  it('should throw an error on an invalid urlString', function() {
    expect(() => getValidUrlFromInput('invalid url string')).toThrowError('Unsupported URL string. URLs should be formatted like a github issue');
    expect(() => getValidUrlFromInput('#')).toThrowError('Unsupported URL string. URLs should be formatted like a github issue');
    expect(() => getValidUrlFromInput('###')).toThrowError('Unsupported URL string. URLs should be formatted like a github issue');
  })
})
