import { addHttpsIfNotLocal } from '../utils/general';

const BASE_URL = addHttpsIfNotLocal(process.env.NEXT_PUBLIC_VERCEL_URL);
const API_URL = new URL(`${BASE_URL}/api/roadmap`);

export { BASE_URL, API_URL };
