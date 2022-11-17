import { slugsFromUrl } from '../../lib/slugsFromUrl';

describe('slugsFromUrl', () => {

  const successCase = '/pln-planning-tools/Starmaps/issues/1'
  it(`should return UrlMatchSlugs for "${successCase}"`, () => {
    expect(slugsFromUrl(successCase)).toEqual({
      index: 0,
      params: {
        owner: 'pln-planning-tools',
        repo: 'Starmaps',
        issue_number: '1',
      },
      path: successCase
    });
  });
  [
    'https://github.com/pln-planning-tools/Starmaps/issues/1',
    'github.com/pln-planning-tools/Starmaps/issues/1',
    'github.com/pln-planning-tools/Starmaps#1',
    'pln-planning-tools/Starmaps/issues/1',
    'pln-planning-tools/Starmaps#1',
  ].forEach((urlString) => {
    it(`should return false for "${urlString}"`, () => {
      expect(slugsFromUrl(urlString)).toEqual(false);
    });
  })
  // it('should return false for partial github issue url', () => {
  //   expect(slugsFromUrl('github.com/pln-planning-tools/Starmaps/issues/1')).toEqual(false);
  // });

  // it('should return false for an issue identifier path', () => {
  //   expect(slugsFromUrl('pln-planning-tools/Starmaps/issues/1')).toEqual(false);
  // });

  // it('should return false for a shorthand github issue identifier', () => {
  //   expect(slugsFromUrl('pln-planning-tools/Starmaps#1')).toEqual(false);
  // });
});
