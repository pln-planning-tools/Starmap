import { SMALL_SCREEN_THRESHOLD } from './../components/theme/constants';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';

export default function useCheckMobileScreen (): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [width, setWidth] = useState(Number.MAX_VALUE);
  const [acknowledgeSmallScreen, setAcknowledgeSmallScreen] = useState(false);
  useEffect(() => {
    // initial width because nextJS doesn't support window on server side.
    setWidth(window.innerWidth);
    // listen to window resize event. from now on.
    window.addEventListener('resize', () => setWidth(window.innerWidth))
  }, []);

  return [(!acknowledgeSmallScreen && width <= SMALL_SCREEN_THRESHOLD), setAcknowledgeSmallScreen];
};
