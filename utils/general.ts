import * as d3 from 'd3';
import _ from 'lodash';
import { match } from 'path-to-regexp';

import { dayjs } from '../lib/client/dayjs';
import { IssueData } from '../lib/types';

export const toTimestamp = (date) => (_.isDate(date) && +new Date(date)) || +new Date(date?.split('-'));

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
  const offsetMax = d3.timeMonth.offset(dates[maxIndex], +Number(offsetEnd));
  const datesWithOffset = dates.concat([offsetMin, offsetMax]);

  return datesWithOffset;
};

export const paramsFromUrl = (url: string) => {
  try {
    return { ...slugsFromUrl(new URL(url).pathname).params };
  } catch (err) {
    console.error('paramsFromUrl error:', err);
  }
};

export const getInternalLinkForIssue = (issue?: IssueData): string => {
  if (issue == null) {
    return '#'
  }
  const urlParams = paramsFromUrl(issue.html_url);
  return `/roadmap/github.com/${urlParams.owner}/${urlParams.repo}/issues/${urlParams.issue_number}`
}

export const formatDateDayJs = (date: string): Date => dayjs(date).utc().toDate();
export const formatDateArrayDayJs = (dates: string[]): Date[] => dates.map((date) => formatDateDayJs(date));
