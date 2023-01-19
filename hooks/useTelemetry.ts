import { useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';

// eslint-disable-next-line react-hooks/rules-of-hooks
const [useTelemetry, setTelemetry] = useSharedHook(useState, null);

export { useTelemetry, setTelemetry };
