import { toTimestamp } from '../utils/general';

export const getTimeline = (data) => {
  console.log('data', data);
  const timestamp = toTimestamp(data.dueDate);
  console.log('timestamp ->', timestamp);
  return data;
};
