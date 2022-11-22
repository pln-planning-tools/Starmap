import { ScaleTime } from 'd3';
import { useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';

const [useGlobalTimeScale, setGlobalTimeScale] = useSharedHook<ScaleTime<number, number> | null>(useState, null);

export { useGlobalTimeScale, setGlobalTimeScale };
