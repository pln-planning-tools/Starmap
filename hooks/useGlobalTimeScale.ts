import { ScaleTime } from 'd3';
import { useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';

const [useGlobalTimeScale, setGlobalTimeScale] = useSharedHook<ScaleTime<Date, number> | null>(useState, null);

export { useGlobalTimeScale, setGlobalTimeScale };
