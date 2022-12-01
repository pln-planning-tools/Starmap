import { getCrumbDataArrayFromCrumbString } from '../../lib/breadcrumbs';

describe('getCrumbDataArrayFromCrumbString', function() {
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
    const resultingCrumbDataArray = getCrumbDataArrayFromCrumbString(crumbString)
    expect(resultingCrumbDataArray).toEqual(expectedCrumbDataArray);
    expect(resultingCrumbDataArray).toHaveLength(1);
    expect(resultingCrumbDataArray[0]).toHaveLength(2);
  });

  it('returns an empty array when JSON is invalid ', () => {
    const resultingCrumbDataArray = getCrumbDataArrayFromCrumbString('foobar123');
    expect(resultingCrumbDataArray).toEqual([]);
    expect(resultingCrumbDataArray).toHaveLength(0);
    expect(spy).toHaveBeenCalledWith('Error parsing crumb string "foobar123"', expect.any(SyntaxError));
    expect(spy).toHaveBeenCalledTimes(1);
    // expect(resultingCrumbDataArray[0]).toHaveLength(2);
  });
})
