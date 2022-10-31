import { getRange } from './getRange';

const timelineTicks = (dates) => {
  const range = getRange(dates);

  return range;
};

export { timelineTicks };
