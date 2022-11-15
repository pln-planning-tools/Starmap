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
    expect(getEtaDate('eta: q4 2022')).toBe('2022-12-31');
    expect(getEtaDate('eta: q3 2024')).toBe('2024-09-30');
    expect(getEtaDate('eta: q2')).toBe(`${new Date().getFullYear()}-06-30`);
  });

  it('should return a date string for months and optional years', () => {
    // quarters
    expect(getEtaDate('eta: dec 2022')).toBe('2022-12-31');
    expect(getEtaDate('eta: july 2024')).toBe('2024-07-31');
    expect(getEtaDate('eta: jan')).toBe(`${new Date().getFullYear()}-01-31`);
  });

  it('should try to parse random dates', () => {
    // quarters
    expect(getEtaDate('eta: 9 dec 2022')).toBe('2022-12-09');
    expect(getEtaDate('eta: july 4, 2024')).toBe('2024-07-04');
    expect(getEtaDate('eta: jan 25')).toBe(`${new Date().getFullYear()}-01-31`);
  });

  it('should return an empty string', () => {
    expect(getEtaDate('eta: 14-11-2022')).toBe(''); // dd-mm-yyyy
    expect(getEtaDate('eta: ')).toBe('');
  });
});
