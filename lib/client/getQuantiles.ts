import { quantile } from 'd3';

import { dayjs } from './dayjs';

const getQuantiles = (ticks: Date[], totalTicks: number): Date[] => {
  // console.log(`getQuantiles | ticks: `, ticks);
  const newTicks = ticks.map((v) => dayjs.utc(v).toDate());
  // const uniqueTicks = [...new Set(newTicks.map((v) => v.getTime()))];
  // console.log(`newTicks: `, [...new Set(newTicks.map((v) => v.getTime()))]);
  // console.log('uniqueTicks:', uniqueTicks);
  const tickIncrement = Number(1 / totalTicks);
  // console.log('totalTicksCalc:', tickIncrement);

  // const newArray = Array(totalTicks)
  //   .fill(Number(0))
  //   .reduce(
  //     (a, b, index) => {
  //       // console.log();
  //       // console.log('a:', a);
  //       // console.log('b:', b);
  //       // console.log('index:', index);
  //       // console.log('a[index - 1]:', a[index]);
  //       const prev = parseFloat((Number(a[index]) || 0).toPrecision(2));
  //       // console.log('prev:', prev);

  //       return [...a, parseFloat(Number(Number(prev) + Number(tickIncrement)).toPrecision(2))];
  //     },
  //     [Number(0)],
  //   )
  //   .map((v: number) => quantile(newTicks, v) as number)
  //   .map((x) => dayjs.utc(x).toDate());
  // console.log('newArray:', newArray);

  // return [0, 0.25, 0.5, 0.75, 1].map((v: number) => quantile(newTicks, v) as number).map((x) => dayjs.utc(x).toDate());
  return Array(totalTicks)
    .fill(Number(0))
    .reduce(
      (a, b, index) => {
        // console.log();
        // console.log('a:', a);
        // console.log('b:', b);
        // console.log('index:', index);
        // console.log('a[index - 1]:', a[index]);
        const prev = parseFloat((Number(a[index]) || 0).toPrecision(2));
        // console.log('prev:', prev);

        return [...a, parseFloat(Number(Number(prev) + Number(tickIncrement)).toPrecision(2))];
      },
      [Number(0)],
    )
    .map((v: number) => quantile(newTicks, v) as number)
    .map((x) => dayjs.utc(x).toDate());
  // quantile(uniqueTicks, 0) as number,
  // quantile(uniqueTicks, 0.25) as number,
  // quantile(uniqueTicks, 0.5) as number,
  // quantile(uniqueTicks, 0.75) as number,
  // quantile(uniqueTicks, 1) as number,
  // quantile(ticks, 0.1) as number,
  // quantile(ticks, 0.2) as number,
  // quantile(ticks, 0.3) as number,
  // quantile(ticks, 0.4) as number,
  // quantile(ticks, 0.5) as number,
  // quantile(ticks, 0.6) as number,
  // quantile(ticks, 0.7) as number,
  // quantile(ticks, 0.8) as number,
  // quantile(ticks, 0.9) as number,
  // quantile(ticks, 1) as number,
  // d3.quantile(ticks, 0.1),
  // d3.quantile(ticks, 0.2) as number,
  // d3.quantile(ticks, 0.3) as number,
  // d3.quantile(ticks, 0.4) as number,
  // d3.quantile(ticks, 0.6) as number,
  // d3.quantile(ticks, 0.7) as number,
  // d3.quantile(ticks, 0.8) as number,
  // d3.quantile(ticks, 0.9) as number,
};

export { getQuantiles };
