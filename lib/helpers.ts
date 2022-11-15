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

// Example: `eta:YYYY-MM-DD` -> `YYYY-MM-DD`
export const getEtaDate = (data: string): string => {
  const etaRegex = /^eta\s*:\s*(?<dateString>[^\n]+)/im;
  const dateString = data.match(etaRegex)?.groups?.dateString.toLowerCase();

  if (!dateString) {
    console.debug('No ETA found');
    return '';
  }

  let etaDate;

  // Check if date is a valid date string.
  etaDate = new Date(dateString);
  if (etaDate.toString() !== 'Invalid Date') {
    return formattedDate(etaDate);
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

  const year = findYear(dateString);

  // date will be the last day of the month. hence incrementing the month + 1 and setting the date to 0.
  return formattedDate(new Date(year, month + 1, 0));
};

export const isValidChildren = (v) => /^children[:]?$/im.test(v);
