import { ScaleTime, scaleTime } from 'd3';

import { dayjs } from './dayjs';

/**
 * TODO: Implement using React Provider pattern
 */
class TimeScaler {
  gridColScale: ScaleTime<number, number>;
  percentageScale: ScaleTime<number, number>;
  constructor() {
    this.percentageScale = scaleTime();
    this.gridColScale = scaleTime();
  }

  setScale(dates: Date[], numCols: number) {
    const validDates = dates.map(dayjs).filter((d) => d.isValid())
    const minDate = dayjs.min(validDates);
    const maxDate = dayjs.max(validDates);
    const domain = [minDate, maxDate];
    this.percentageScale = scaleTime().domain(domain).range([0, 1]);
    this.gridColScale = scaleTime().domain(domain).range([0, numCols]);
  }

  getDomain() {
    return this.percentageScale.domain();
  }

  getPercentileInverse(num: number) {
    return this.percentageScale.invert(num)
  }
  getPercentile(date: Date) {
    return this.percentageScale(date)
  }

  getColumn(date: Date) {
    return this.gridColScale(date)
  }
}


export const globalTimeScaler = new TimeScaler();
