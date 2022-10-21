const BASE_PROTOCOL = (!!process.env.IS_LOCAL && 'http') || 'https';
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;
const API_URL = new URL(`${BASE_PROTOCOL}://${BASE_URL}/api/roadmap`);

const TEN_DAYS_IN_SECONDS = 864000;
const OFFSET_MIN_MONTHS = 2;
const OFFSET_MAX_MONTHS = 3;

export { API_URL, TEN_DAYS_IN_SECONDS, OFFSET_MIN_MONTHS, OFFSET_MAX_MONTHS };
