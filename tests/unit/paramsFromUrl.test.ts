import { paramsFromUrl } from '../../lib/paramsFromUrl';

describe('paramsFromUrl', function() {
  it('should return UrlMatchSlugs for full github issue url', () => {
    expect(paramsFromUrl('https://github.com/pln-planning-tools/Starmaps/issues/1')).toEqual({
      owner: 'pln-planning-tools',
      repo: 'Starmaps',
      issue_number: '1',
    });
  });

  it('should return UrlMatchSlugs for partial github issue url', () => {
    expect(paramsFromUrl('github.com/pln-planning-tools/Starmaps/issues/1')).toEqual({
      owner: 'pln-planning-tools',
      repo: 'Starmaps',
      issue_number: '1',
    });
  });

  it('should return UrlMatchSlugs for an issue identifier path', () => {
    expect(paramsFromUrl('pln-planning-tools/Starmaps/issues/1')).toEqual({
      owner: 'pln-planning-tools',
      repo: 'Starmaps',
      issue_number: '1',
    });
  });

  it('should return UrlMatchSlugs for a shorthand github issue identifier', () => {
    expect(paramsFromUrl('pln-planning-tools/Starmaps#1')).toEqual({
      owner: 'pln-planning-tools',
      repo: 'Starmaps',
      issue_number: '1',
    });
  });

  it('Should not throw an error for a url with hashString', () => {
    expect(paramsFromUrl('https://github.com/ipfs/kubo/issues/6523#issuecomment-547254760')).toEqual({
      owner: 'ipfs',
      repo: 'kubo',
      issue_number: '6523',
    });
  })
})
