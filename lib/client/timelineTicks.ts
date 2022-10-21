import { addOffset } from '../../utils/general';
import { getRange } from './getRange';

const timelineTicks = (dates) => {
  console.log(`ticks dates: `, dates);
  const datesWithOffset = addOffset(dates);
  const range = getRange(datesWithOffset);
  return range;
};

export { timelineTicks };
