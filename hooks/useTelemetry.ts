import { useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';
import type { BrowserMetricsProvider } from '../lib/types';

// eslint-disable-next-line react-hooks/rules-of-hooks
const [useTelemetry, setTelemetry] = useSharedHook<InstanceType<BrowserMetricsProvider>|null>(useState, null);

export { useTelemetry, setTelemetry };
