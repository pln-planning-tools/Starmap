import * as d3 from 'd3';
import _ from 'lodash';
import { match } from 'path-to-regexp';

import { dayjs } from '../lib/client/dayjs';

import { OFFSET_MAX_MONTHS, OFFSET_MIN_MONTHS } from '../config/constants';

export const toTimestamp = (date) => (_.isDate(date) && +new Date(date)) || +new Date(date?.split('-'));

// https://github.com/pln-roadmap/tests/issues/9
export const slugsFromUrl: any = (url: string) => {
  const matchResult = match('/:owner/:repo/issues/:issue_number(\\d+)', {
    decode: decodeURIComponent,
  })(url);
  return matchResult;
};

export const formatDate = (date) => {
  if (_.isDate(date)) {
    return +new Date(date);
  } else {
    return +new Date(date?.split('-'));
  }
};

export const addOffset = (dates: Date[], { offsetStart, offsetEnd }: { offsetStart: number; offsetEnd: number }) => {
  const minIndex = d3.minIndex(dates);
  const maxIndex = d3.maxIndex(dates);
  const offsetMin = d3.timeMonth.offset(dates[minIndex], -Number(offsetStart));
  // console.log('offsetMin:', offsetMin);
  const offsetMax = d3.timeMonth.offset(dates[maxIndex], +Number(offsetEnd));
  const datesWithOffset = dates.concat([offsetMin, offsetMax]);

  return datesWithOffset;
};

export const paramsFromUrl = (url) => {
  try {
    return { ...slugsFromUrl(new URL(url).pathname).params };
  } catch (err) {
    // console.error('error:', err);
  }
};

export const formatDateDayJs = (date: string): Date => dayjs(date).utc().toDate();
export const formatDateArrayDayJs = (dates: string[]): Date[] => dates.map((date) => formatDateDayJs(date));
