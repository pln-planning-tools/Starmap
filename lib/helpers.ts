import { dayjs } from './client/dayjs';
import type { ErrorManager } from './backend/errorManager';
import type { IssueData } from './types';

/**
 * deprecating non-ISO 8601 date formats
 * @see https://github.com/pln-planning-tools/Starmap/issues/311
 * @see https://github.com/pln-planning-tools/Starmap/issues/275
 */
const errorTitle = 'ETA format deprecated';
const errorMessage = 'ETA must use ISO 8601 standard (YYYY-MM-DD). Please see https://github.com/pln-planning-tools/Starmap/issues/275';

/**
 * Date parser based on: https://github.com/pln-planning-tools/Starmap/blob/main/User%20Guide.md#eta-requirement
 *
 * @param {string} data - the data that contains the date.
 * @returns {string} etaDate
 */
export const getEtaDate = (data: string, config: { addError: ErrorManager['addError'], issue: Pick<IssueData, 'html_url' | 'title'> }): string => {
  // how this works: https://www.debuggex.com/r/x-U2AnhTwWbSCXCD

  const etaRegex = /^eta\s*:\s*(?<dateString>\d{4}(Q[1-4]|\-\d{2}(\-\d{2})?))/im;
  const dateString = data.match(etaRegex)?.groups?.dateString;

  if (!dateString) {
    throw new Error('No ETA date found');
  }

  const year = parseInt(dateString.slice(0, 4));
  let etaDate = dayjs().year(year);

  if (dateString[4] === 'Q') {
    if (config.addError) {
      config.addError({
        issue: config.issue,
        userGuideSection: '#eta',
        errorTitle,
        errorMessage,
      });
    }
    etaDate = etaDate
      .quarter(parseInt(dateString[5]))
      .endOf('quarter');
  } else {
    etaDate = etaDate.month(parseInt(dateString.slice(5, 7)) - 1);
    if (dateString.length === 7) {
      if (config.addError) {
        config.addError({
          issue: config.issue,
          userGuideSection: '#eta',
          errorTitle,
          errorMessage,
        });
      }
      etaDate = etaDate.endOf('month');
    } else {
      etaDate = etaDate.date(parseInt(dateString.slice(8, 10)));
    }
  }

  return etaDate.format('YYYY-MM-DD');
};

export const isValidChildren = (v) => /^children[:]?$/im.test(v);

export const getTimeFromDateString = (dateString: string, defaultValue: number): number => {
  try {
    return new Date(dateString).getTime();
  } catch {
    return defaultValue;
  }
}
