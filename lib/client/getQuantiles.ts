import { quantile } from 'd3';

import { dayjs } from './dayjs';

const getQuantiles = (ticks: Date[], totalTicks: number): Date[] => {
  const newTicks = ticks.map((v) => dayjs.utc(v).toDate());
  const tickIncrement = Number(1 / totalTicks);

  return Array(totalTicks)
    .fill(Number(0))
    .reduce(
      (a, b, index) => {
        const prev = parseFloat((Number(a[index]) || 0).toPrecision(2));

        return [...a, parseFloat(Number(Number(prev) + Number(tickIncrement)).toPrecision(2))];
      },
      [Number(0)],
    )
    .map((v: number) => quantile(newTicks, v) as number)
    .map((x) => dayjs.utc(x).toDate());
};

export { getQuantiles };
