import * as d3 from 'd3';

const getQuantiles = (ticks): number[] => {
  console.log(`ticks: `, ticks);

  return [
  d3.quantile(ticks, 0) as number,
  // d3.quantile(ticks, 0.1),
  d3.quantile(ticks, 0.2) as number,
  // d3.quantile(ticks, 0.3),
  d3.quantile(ticks, 0.4) as number,
  d3.quantile(ticks, 0.5) as number,
  d3.quantile(ticks, 0.6) as number,
  // d3.quantile(ticks, 0.7),
  d3.quantile(ticks, 0.8) as number,
  d3.quantile(ticks, 0.9) as number,
  d3.quantile(ticks, 1) as number,
];
}

export {getQuantiles}
