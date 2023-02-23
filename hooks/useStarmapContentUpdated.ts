import Toast from 'awesome-toast-component';
import { useEffect, useState } from 'react';
import { useGlobalLoadingState } from './useGlobalLoadingState';

const FIRST_LOAD_KEY_PREFIX = 'starmap:content:updated:first-load:';

export default async function useStarmapUpdateAvailable(): Promise<void> {
  const globalLoadingState = useGlobalLoadingState();
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    window.document.addEventListener('starmap:content:updated', ({ detail }) => {
      if (detail.cacheName === 'milestones' || detail.cacheName === 'roadmap') {
        setUpdateAvailable(true);
      }
    })
  });

  useEffect(() => {
    const firstLoadKey = `${FIRST_LOAD_KEY_PREFIX}${window.location.pathname}`;
    // If this is the first time the user is loading the page, don't show the toast.
    // Using localStorage to persist this value across page refreshes.
    // Because localStorage is synchronous.
    const isFirstLoad = localStorage.getItem(firstLoadKey) === null;
    if (updateAvailable && !globalLoadingState.get()) {
      if (isFirstLoad) {
        localStorage.setItem(firstLoadKey, 'true');
      } else {
        new Toast('Starmap Content Updated! Please Refresh.', {
          timeout: 0,
          style: {
            container: [
              ['border-radius', '8px']
            ]
          }
        })
      }
      setUpdateAvailable(false);
    }
  }, [updateAvailable, globalLoadingState]);
};
