import { useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';

const [useShowTodayMarker, setShowTodayMarker] = useSharedHook(useState, false);

export { useShowTodayMarker, setShowTodayMarker };
