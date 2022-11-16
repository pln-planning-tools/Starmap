import { useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';
import { ViewMode } from '../lib/enums';

const [useViewMode, setViewMode] = useSharedHook(useState, ViewMode.Simple);

export { useViewMode, setViewMode };
