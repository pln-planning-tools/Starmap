import { useState } from 'react';
import useSharedHook from '../lib/client/createSharedHook';

const [useIsLoading, setIsLoading] = useSharedHook(useState, false)

export { useIsLoading, setIsLoading };

