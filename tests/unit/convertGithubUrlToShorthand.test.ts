import { convertGithubUrlToShorthand } from '../../lib/convertGithubUrlToShorthand';

describe('convertGithubUrlToShorthand', function() {
  it('returns the correct shorthand', () => {
    const url = new URL('https://github.com/pln-planning-tools/StarMaps/issues/1');
    expect(convertGithubUrlToShorthand(url)).toEqual('pln-planning-tools/StarMaps#1');
  })
})
