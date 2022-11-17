import * as d3 from 'd3';
import _ from 'lodash';

import { dayjs } from './client/dayjs';
import { paramsFromUrl } from './paramsFromUrl';
import { IssueData } from './types';

export const toTimestamp = (date) => (_.isDate(date) && +new Date(date)) || +new Date(date?.split('-'));


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

export const getInternalLinkForIssue = (issue?: IssueData): string => {
  if (issue == null) {
    return '#'
  }
  const urlParams = paramsFromUrl(issue.html_url);
  return `/roadmap/github.com/${urlParams.owner}/${urlParams.repo}/issues/${urlParams.issue_number}`
}

export const formatDateDayJs = (date: string): Date => dayjs(date).utc().toDate();
export const formatDateArrayDayJs = (dates: string[]): Date[] => dates.map((date) => formatDateDayJs(date));
