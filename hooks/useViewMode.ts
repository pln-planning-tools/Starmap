import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { createLocalStorage } from 'localstorage-ponyfill';

import useSharedHook from '../lib/client/createSharedHook';
import { ViewMode } from '../lib/enums';

const LOCAL_STORAGE_CACHE_KEY = 'useViewModeCache'
const customStateFunction: typeof useState = <S = typeof ViewMode>(initialState?: S) => {
  const localStorage = createLocalStorage();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const cachedValue = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
    const actualCachedValue: S | null = cachedValue ? JSON.parse(cachedValue) : null;
    if (actualCachedValue != null && actualCachedValue !== state) {
      setState(actualCachedValue);
    }

  }, [state, setState, localStorage]);

  const setCachedState = (newState: S) => {
    localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(newState));
    setState(newState);
  };

  if (typeof initialState === 'undefined') {
    return [state, setCachedState] as [S, Dispatch<SetStateAction<S>>];
  }
  return [state, setCachedState] as [S | undefined, Dispatch<SetStateAction<S | undefined>>];
}

const [useViewMode, setViewMode] = useSharedHook(customStateFunction, ViewMode.Simple);

export { useViewMode, setViewMode };
