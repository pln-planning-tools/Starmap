const MONTH_MAPPER = {
  'jan': 1,
  'feb': 2,
  'mar': 3,
  'apr': 4,
  'may': 5,
  'jun': 6,
  'jul': 7,
  'aug': 8,
  'sep': 9,
  'oct': 10,
  'nov': 11,
  'dec': 12
};

const formattedDate = (date: Date): string => date.toISOString().slice(0, 10);
const findYear = (date: string): number => parseInt(date.match(/\d{4}/)?.[0] || '0') || new Date().getFullYear();
const findDay = (date: string): number => parseInt(date.match(/[^\d]\d{1,2}[^\d]/)?.[0] || '0') || 0;

// Example: `eta:YYYY-MM-DD` -> `YYYY-MM-DD`
export const getEtaDate = (data: string): string => {
  const etaRegex = /^eta\s*:\s*(?<dateString>[^\n]+)/im;
  const dateString = data.match(etaRegex)?.groups?.dateString.toLowerCase();

  if (!dateString) {
    console.debug('No ETA found');
    return '';
  }

  let month;
  // Check for month.
  if (dateString.slice(0, 3) in MONTH_MAPPER) {
    month = MONTH_MAPPER[dateString.slice(0, 3).toLowerCase()];
  }

  // check for quarter
  if (dateString[0] === 'q') {
    const quarter = parseInt(dateString[1]);
    if (quarter < 5 && quarter > 0) {
      month = quarter * 3;
    }
  }

  if (month) {
    const year = findYear(dateString);
    const day = findDay(dateString);
    if (day !== 0) {
      month -= 1; // months are zero indexed
    }
    
    // date will be the last day of the month. hence incrementing the month + 1 and setting the date to 0.
    return formattedDate(new Date(year, month, day));
  }

  // Check if date is a valid date string at the end, because we don't want to
  // return dec 2022 as 2022 - 12 - 01 but instead 2022 - 12 - 31
  const etaDate = new Date(dateString);
  if (etaDate.toString() !== 'Invalid Date') {
    return formattedDate(etaDate);
  }

  return '';
};

export const isValidChildren = (v) => /^children[:]?$/im.test(v);
