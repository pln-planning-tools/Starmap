import { useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';


interface MilestoneRect extends DOMRect {
  id: string
  title: string
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const [useMilestoneBoundingRects, setMilestoneBoundingRects] = useSharedHook<MilestoneRect[]>(useState, []);

export { useMilestoneBoundingRects, setMilestoneBoundingRects };
