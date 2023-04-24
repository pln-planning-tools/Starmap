import { getEtaDate } from '../../lib/helpers';

describe('getEtaDate', () => {
  const config = { addError: jest.fn(), issue: { html_url: 'test', title: 'test' } }
  beforeEach(function () {
    jest.resetAllMocks()
  })
  function ensureDeprecationError(callNumber: number) {

    expect(config.addError).toHaveBeenCalledTimes(callNumber)
    expect(config.addError.mock.calls[callNumber-1][0]).toHaveProperty('errorTitle', 'ETA format deprecated');
    expect(config.addError.mock.calls[callNumber-1][0]).toHaveProperty('errorMessage', 'ETA must use ISO 8601 standard (YYYY-MM-DD). Please see https://github.com/pln-planning-tools/Starmap/issues/275');
  }

  it('should return a date string for YYYY-MM-DD', () => {
    // dates
    expect(getEtaDate('eta:2022-11-14', config)).toBe('2022-11-14');
    expect(config.addError).toHaveBeenCalledTimes(0)
    expect(getEtaDate('eta : 2022-11-14', config)).toBe('2022-11-14');
    expect(config.addError).toHaveBeenCalledTimes(0)
    expect(getEtaDate('eta: 2022-11-14', config)).toBe('2022-11-14');
    expect(config.addError).toHaveBeenCalledTimes(0)
    expect(getEtaDate('ETA: 2022-11-14', config)).toBe('2022-11-14');
    expect(config.addError).toHaveBeenCalledTimes(0)
  });

  it('should return a date string for quarters and optional years', () => {
    // quarters
    expect(getEtaDate('eta: 2022Q4', config)).toBe('2022-12-31');
    ensureDeprecationError(1)
    expect(getEtaDate('eta: 2024Q3', config)).toBe('2024-09-30');
    ensureDeprecationError(2)
  });

  it('should return a date string for months and optional years', () => {
    // months + years
    expect(getEtaDate('eta: 2022-12', config)).toBe('2022-12-31');
    ensureDeprecationError(1)
    expect(getEtaDate('eta: 2024-07', config)).toBe('2024-07-31');
    ensureDeprecationError(2)
  });

  it('should throw error when date is malformed.', () => {
    // invalid dates
    expect(() => getEtaDate('eta: 14-11-2022', config)).toThrow(); // dd-mm-yyyy
    expect(() => getEtaDate('eta: ', config)).toThrow(); // empty
  });
});
