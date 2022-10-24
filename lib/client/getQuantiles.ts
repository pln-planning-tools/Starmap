import { quantile } from 'd3';

const getQuantiles = (ticks): number[] => {
  // console.log(`getQuantiles() | ticks: `, ticks);

  return [
    quantile(ticks, 0) as number,
    // d3.quantile(ticks, 0.1),
    // d3.quantile(ticks, 0.2) as number,
    quantile(ticks, 0.25) as number,
    // d3.quantile(ticks, 0.3) as number,
    // d3.quantile(ticks, 0.4) as number,
    quantile(ticks, 0.5) as number,
    // d3.quantile(ticks, 0.6) as number,
    // d3.quantile(ticks, 0.7) as number,
    quantile(ticks, 0.75) as number,
    // d3.quantile(ticks, 0.8) as number,
    // d3.quantile(ticks, 0.9) as number,
    quantile(ticks, 1) as number,
  ];
};

export { getQuantiles };
