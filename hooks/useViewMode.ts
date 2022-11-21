import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import useSharedHook from '../lib/client/createSharedHook';
import { ViewMode } from '../lib/enums';

const LOCAL_STORAGE_CACHE_KEY = 'useViewModeCache'
const DEFAULT_INITIAL_VIEW_MODE = ViewMode.Simple;

const customStateFunction: typeof useState = <S = typeof ViewMode>(initialState?: S) => {

  const [state, setState] = useState(initialState);

  const getCurrentValueFromStorage = () => {
    const persistedValue = localStorage?.getItem(LOCAL_STORAGE_CACHE_KEY);
    const actualPersistedValue = JSON.parse(persistedValue ?? '""');
    return actualPersistedValue;
  };

  /**
   * Update the saved localStorage value to equal the current localStorage State
   * value if the values are in sync.
   */
  useEffect(() => {
    const actualPersistedValue = getCurrentValueFromStorage();
    if (!state) {
      const initialStateFromStorage = actualPersistedValue === '' ? DEFAULT_INITIAL_VIEW_MODE : actualPersistedValue;
      setState(initialStateFromStorage);
    } else {
      if (actualPersistedValue !== state) {
        localStorage?.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(state));
      }
    }
  }, [state])

  /**
   * Update the actual viewMode value if it is different from what is in localStorage
   */
  useEffect(() => {
    const actualPersistedValue = getCurrentValueFromStorage();
    if (actualPersistedValue !== state) {
      setState(actualPersistedValue);
    }
  }, [state]);

  if (typeof initialState === 'undefined') {
    return [state, setState] as [S, Dispatch<SetStateAction<S>>];
  }
  return [state, setState] as [S | undefined, Dispatch<SetStateAction<S | undefined>>];
}

const [useViewMode, setViewMode] = useSharedHook(customStateFunction, undefined);

export { useViewMode, setViewMode };
