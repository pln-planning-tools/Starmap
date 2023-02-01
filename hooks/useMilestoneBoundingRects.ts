import { useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';

// eslint-disable-next-line react-hooks/rules-of-hooks
const [useMilestoneBoundingRects, setMilestoneBoundingRects] = useSharedHook<(DOMRect & {id: string})[]>(useState, []);

export { useMilestoneBoundingRects, setMilestoneBoundingRects };
