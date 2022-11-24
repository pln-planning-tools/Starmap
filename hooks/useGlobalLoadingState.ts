import { hookstate, State, useHookstate } from '@hookstate/core';

const globalLoadingState = hookstate(false);
const wrapState = (s: State<boolean>) => ({
  get: () => s.value,
  toggle: () => s.set(p => !p),
  start: () => s.set(true),
  stop: () => s.set(false),
  set: (v: boolean) => s.set(v),
})

// The following 2 functions can be exported now:
export const accessGlobalLoadingState = () => wrapState(globalLoadingState)
export const useGlobalLoadingState = () => wrapState(useHookstate(globalLoadingState))

