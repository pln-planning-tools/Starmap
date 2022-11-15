const BASE_PROTOCOL = (!!process.env.IS_LOCAL && 'http') || 'https';
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;
export const API_URL = new URL(`${BASE_PROTOCOL}://${BASE_URL}/api/roadmap`);

export const TEN_DAYS_IN_SECONDS = 864000;
export const OFFSET_MIN_MONTHS = 2;
export const OFFSET_MAX_MONTHS = 3;
export const DEFAULT_TICK_COUNT = 5;
