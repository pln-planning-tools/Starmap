import * as d3 from 'd3';

const getRange = (dates: any[]) => {
  const min = d3.min(dates);
  const max = d3.max(dates);
  const count = 9;
  const ticks = d3.utcTicks(min, max, count);
  // var x = d3.scaleUtc().domain([-1, 1]).range([min, max]);
  // var xTicks = x.ticks(5);
  // console.log('ticks ->', xTicks);
  const quantiles = [
    d3.quantile(ticks, 0),
    d3.quantile(ticks, 0.1),
    d3.quantile(ticks, 0.2),
    d3.quantile(ticks, 0.3),
    d3.quantile(ticks, 0.4),
    d3.quantile(ticks, 0.5),
    d3.quantile(ticks, 0.6),
    d3.quantile(ticks, 0.7),
    d3.quantile(ticks, 0.8),
    d3.quantile(ticks, 0.9),
    d3.quantile(ticks, 1),
  ];
  console.log('quantiles ->', quantiles);
  return ticks;
};

export { getRange };
