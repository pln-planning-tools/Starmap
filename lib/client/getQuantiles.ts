import { quantile, scaleTime } from 'd3';

import { dayjs } from './dayjs';

/**
 * Given an array of dates and totalNumber of ticks to display, return an array of dates
 *
 * @param ticks
 * @param totalTicks
 * @returns
 */
const getQuantilesNew = (ticks: Date[], totalTicks: number): Date[] => {
  const newTicks = ticks.map((v) => dayjs.utc(v));
  const scaleDate = scaleTime()
    .domain([dayjs.min(newTicks).toDate(), dayjs.max(newTicks).toDate()])
    .range([1, totalTicks]);

  const results: Date[] = [];
  for (let i = 1; i <= totalTicks; i++) {
    const quantileValue = scaleDate.invert(i);
    if (quantileValue) {
      results.push(dayjs.utc(quantileValue).toDate());
    }
  }
  return results;
}

/**
 * Given an array of dates and totalNumber of ticks to display, return an array of dates
 *
 * @param ticks
 * @param totalTicks
 * @returns
 */
const getQuantiles = (ticks: Date[], totalTicks: number): Date[] => {
  const newTicks = ticks.map((v) => dayjs.utc(v).toDate());
  const tickIncrement = Number(1 / totalTicks);

  return Array(totalTicks)
    .fill(Number(0))
    .reduce(
      (a, _b, index) => {
        const prev = parseFloat((Number(a[index]) || 0).toPrecision(2));

        return [...a, parseFloat(Number(Number(prev) + Number(tickIncrement)).toPrecision(2))];
      },
      [Number(0)],
    )
    .map((v: number) => quantile(newTicks, v) as number)
    .map((x) => dayjs.utc(x).toDate());
};

export { getQuantiles, getQuantilesNew };
