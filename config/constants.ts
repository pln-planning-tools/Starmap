const BASE_PROTOCOL = (!!process.env.IS_LOCAL && 'http') || 'https';
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;
const API_URL = new URL(`${BASE_PROTOCOL}://${BASE_URL}/api/roadmap`);
const DEFAULT_TICK_COUNT = 5;
const OFFSET_MAX_MONTHS = 3;
const OFFSET_MIN_MONTHS = 2;
const TEN_DAYS_IN_SECONDS = 864000;

export {
  API_URL,
  DEFAULT_TICK_COUNT,
  OFFSET_MAX_MONTHS,
  OFFSET_MIN_MONTHS,
  TEN_DAYS_IN_SECONDS
}
