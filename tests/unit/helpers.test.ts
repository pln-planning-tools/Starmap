import { getEtaDate } from '../../lib/helpers';

describe('getEtaDate', () => {
  it('should return a date string for YYYY-MM-DD', () => {
    // dates
    expect(getEtaDate('eta:2022-11-14')).toBe('2022-11-14');
    expect(getEtaDate('eta : 2022-11-14')).toBe('2022-11-14');
    expect(getEtaDate('eta: 2022-11-14')).toBe('2022-11-14');
  });

  it('should return a date string for quarters and optional years', () => {
    // quarters
    expect(getEtaDate('eta: 2022Q4')).toBe('2022-12-31');
    expect(getEtaDate('eta: 2024Q3')).toBe('2024-09-30');
  });

  it('should return a date string for months and optional years', () => {
    // months + years
    expect(getEtaDate('eta: 2022-12')).toBe('2022-12-31');
    expect(getEtaDate('eta: 2024-07')).toBe('2024-07-31');
  });

  it('should throw error when date is malformed.', () => {
    // invalid dates
    expect(() => getEtaDate('eta: 14-11-2022')).toThrow(); // dd-mm-yyyy
    expect(() => getEtaDate('eta: ')).toThrow(); // empty
  });
});
