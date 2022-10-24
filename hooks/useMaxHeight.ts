import { useEffect, useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';

const [useMaxHeight, setMaxHeight] = useSharedHook(useState, 600);

export { useMaxHeight, setMaxHeight };
