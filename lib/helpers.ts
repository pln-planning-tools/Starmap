import { dayjs } from './client/dayjs';

/**
 * Date parser based on: https://github.com/pln-planning-tools/Starmaps/blob/main/User%20Guide.md#eta
 *
 * @param {string} data - the data that contains the date.
 * @returns {string} etaDate
 */
export const getEtaDate = (data: string): string | null => {
  // how this works: https://www.debuggex.com/r/x-U2AnhTwWbSCXCD

  const etaRegex = /^eta\s*:\s*(?<dateString>\d{4}(Q[1-4]|\-\d{2}(\-\d{2})?))/im;
  const dateString = data.match(etaRegex)?.groups?.dateString;

  if (!dateString) {
    console.debug('No ETA date found');
    return null;
  }

  const year = parseInt(dateString.slice(0, 4));
  let etaDate = dayjs().year(year);

  if (dateString[4] === 'Q') {
    etaDate = etaDate
      .quarter(parseInt(dateString[5]))
      .endOf('quarter');
  } else {
    etaDate = etaDate.month(parseInt(dateString.slice(5, 7)) - 1);
    if (dateString.length === 7) {
      etaDate = etaDate.endOf('month');
    } else {
      etaDate = etaDate.date(parseInt(dateString.slice(8, 10)));
    }
  }

  return etaDate.format('YYYY-MM-DD');
};

export const isValidChildren = (v) => /^children[:]?$/im.test(v);
