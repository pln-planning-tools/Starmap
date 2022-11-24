export const BASE_PROTOCOL = (!!process.env.IS_LOCAL && 'http') || 'https';
export const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;
export const DEFAULT_TICK_COUNT = 5;
export const OFFSET_MAX_MONTHS = 3;
export const OFFSET_MIN_MONTHS = 2;
export const TEN_DAYS_IN_SECONDS = 864000;
