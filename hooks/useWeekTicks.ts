import { useState } from 'react';
import useSharedHook from '../lib/client/createSharedHook';

const [useWeekTicks, setWeekTicks] = useSharedHook(useState, 4)

export { useWeekTicks, setWeekTicks };
