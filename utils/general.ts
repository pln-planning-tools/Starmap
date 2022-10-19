import * as d3 from 'd3';
import dayjs from 'dayjs';
import _ from 'lodash';
import { match } from 'path-to-regexp';

export const TEN_DAYS_IN_SECONDS = 864000;

export const addHttpsIfNotLocal = (url: any) => {
  console.log('url', url);
  // console.log('process.env.IS_LOCAL ->', process.env.IS_LOCAL);
  if (process.env.IS_LOCAL) {
    return url;
  }
  console.log('after!', url);
  return 'https://' + url;
};

export const toTimestamp = (date) => (_.isDate(date) && +new Date(date)) || +new Date(date?.split('-'));

// https://github.com/pln-roadmap/tests/issues/9
export const urlMatch: any = (url) => {
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

export const addOffset = (dates) => {
  // const offsetMin = dates[d3.minIndex(dates)] - TEN_DAYS_IN_SECONDS;
  // const offsetMax = dates[d3.maxIndex(dates)] + TEN_DAYS_IN_SECONDS;
  const OFFSET_MIN_MONTHS = 2;
  const OFFSET_MAX_MONTHS = 3;
  const offsetMin = +d3.timeMonth.offset(dates[d3.minIndex(dates)], -OFFSET_MIN_MONTHS);
  const offsetMax = +d3.timeMonth.offset(dates[d3.maxIndex(dates)], +OFFSET_MAX_MONTHS);
  const datesWithOffset = dates.concat([offsetMin, offsetMax]);
  // const datesWithOffset = d3.timeDay.offset(dates, 1)
  console.log('dateWithOffset ->', datesWithOffset);
  return datesWithOffset;
};
