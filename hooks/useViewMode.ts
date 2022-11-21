import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';
import { ViewMode } from '../lib/enums';

const LOCAL_STORAGE_CACHE_KEY = 'useViewModeCache'
const customStateFunction: typeof useState = <S = typeof ViewMode>(initialState?: S) => {

  const [state, setState] = useState(initialState);
  /**
   * We should only access localStorage inside useEffect because otherwise nextjs
   * will try to use it on the server and it will fail.
   */
  const [localStorageValue, setLocalStorageValue] = useState<S | null>(null);

  /**
   * Update localStorageValue to equal what is in localStorage
   */
  useEffect(() => {
    if (localStorage != null) {
      const cachedValue = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      const actualCachedValue = cachedValue != null ? JSON.parse(cachedValue) : null;
      setLocalStorageValue(actualCachedValue);
    }
  }, [setLocalStorageValue])

  /**
   * Update the saved localStorage value to equal the current localStorage State
   * value if the values are in sync.
   */
  useEffect(() => {

    if (localStorage != null && state === localStorageValue) {
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(localStorageValue));
    }
  }, [state, localStorageValue])

  /**
   * Update the actual viewMode value if it is different from what is in localStorage
   */
  useEffect(() => {
    if (localStorageValue != null && localStorageValue !== state) {
      setState(localStorageValue);
    }
  }, [state, setState, localStorageValue]);

  /**
   * Update both the actual viewMode value and the localStorage value
   * @param {S} newState - the new value to set
   */
  const setCachedState = (newState: S) => {
    setLocalStorageValue(newState);
    setState(newState);
  };

  if (typeof initialState === 'undefined') {
    return [state, setCachedState] as [S, Dispatch<SetStateAction<S>>];
  }
  return [state, setCachedState] as [S | undefined, Dispatch<SetStateAction<S | undefined>>];
}

const [useViewMode, setViewMode] = useSharedHook(customStateFunction, ViewMode.Simple);

export { useViewMode, setViewMode };
