import { useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';
import { DateGranularityState } from '../lib/enums';

const [useDateGranularity, setDateGranularity] = useSharedHook(useState, DateGranularityState.Months);

export { useDateGranularity, setDateGranularity };
