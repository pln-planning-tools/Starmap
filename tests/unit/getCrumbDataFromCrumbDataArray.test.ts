/**
 * @jest-environment jsdom
 */
import { getCrumbDataFromCrumbDataArray, getCrumbDataArrayFromCrumbString } from '../../lib/breadcrumbs';
import { ViewMode } from '../../lib/enums';

describe('getCrumbDataFromCrumbDataArray', function() {
  let spy: jest.SpyInstance;
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    spy = jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    spy.mockRestore();
  });

  it('returns correct data for single crumbString', () => {
    const expectedCrumbDataArray = [[ 'owner/repo#1', 'Issue 1' ]]
    const crumbString = JSON.stringify(expectedCrumbDataArray);
    const crumbDataArray = getCrumbDataArrayFromCrumbString(crumbString);
    const resultingCrumbData = getCrumbDataFromCrumbDataArray(crumbDataArray, ViewMode.Detail);
    expect(resultingCrumbData).toEqual([{
      title: 'Issue 1',
      url: 'http://localhost/roadmap/github.com/owner/repo/issues/1#detail',
    }]);
  });

  it('returns an empty array when crumbString is invalid ', () => {
    const crumbDataArray = getCrumbDataArrayFromCrumbString('foobar123');
    const resultingCrumbData = getCrumbDataFromCrumbDataArray(crumbDataArray, ViewMode.Detail);
    expect(resultingCrumbData).toEqual([]);
  });
})
