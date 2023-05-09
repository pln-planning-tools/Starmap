import { useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';

// eslint-disable-next-line react-hooks/rules-of-hooks
const [useLegacyView, setLegacyView] = useSharedHook(useState, false);

export { useLegacyView, setLegacyView };
