/**
 * Date parser based on: https://github.com/pln-planning-tools/Starmaps/blob/main/User%20Guide.md#eta
 *
 * @param {string} data - the data that contains the date.
 * @returns {string} etaDate
 */
export const getEtaDate = (data: string): string => {
  // how this works: https://www.debuggex.com/r/x-U2AnhTwWbSCXCD

  const etaRegex = /^eta\s*:\s*(?<dateString>\d{4}(Q[1-4]|\-\d{2}(\-\d{2})?))/im;
  const dateString = data.match(etaRegex)?.groups?.dateString.toLowerCase();

  if (!dateString) {
    throw new Error('No ETA date found');
  }

  const year = parseInt(dateString.slice(0, 4));

  let day = 0;
  let month;
  // check for quarter
  if (dateString[4] === 'q') {
    const quarter = parseInt(dateString[5]);
    if (quarter < 5 && quarter > 0) {
      month = quarter * 3;
    }
  } else {
    month = parseInt(dateString.slice(5, 7));
    if (dateString.length === 10) {
      day = parseInt(dateString.slice(8, 10));
      month -= 1; // months are 0-indexed
    }
  }

  const date = new Date(year, month, day);
  return date.toISOString().slice(0, 10);
};

export const isValidChildren = (v) => /^children[:]?$/im.test(v);
