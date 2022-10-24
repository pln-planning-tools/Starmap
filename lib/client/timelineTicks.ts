import { addOffset } from '../../utils/general';
import { dayjs } from './dayjs';
import { getRange } from './getRange';

const timelineTicks = (dates) => {
  // console.log(`ticks dates: `, dates);
  // const datesWithOffset = addOffset(dates);
  // const range = getRange(datesWithOffset);
  const range = getRange(dates);

  return range;
};

export { timelineTicks };
