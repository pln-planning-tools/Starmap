import Router from 'next/router';
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

Router.events.on("routeChangeError", (err, url, { shallow }) => {
    console.error("Navigating to: " + "url: " + url, {cancelled: err.cancelled} )
});

// Router.events.on('hashChangeStart', () => {
//   accessGlobalLoadingState().start()
// })
// Router.events.on('hashChangeComplete', () => {
//   accessGlobalLoadingState().stop()
// })
Router.events.on('routeChangeStart', (...events) => {
  console.log('routerChangeStart', events);
});
Router.events.on('hashChangeStart', accessGlobalLoadingState().start);
Router.events.on('hashChangeComplete', accessGlobalLoadingState().stop);
Router.events.on('routeChangeStart', accessGlobalLoadingState().start);
Router.events.on('routeChangeComplete', accessGlobalLoadingState().stop);
