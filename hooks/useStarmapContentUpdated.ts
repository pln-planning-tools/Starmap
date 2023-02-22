import { useEffect } from 'react';
import Toast from 'awesome-toast-component'

export default function useStarmapContentUpdated (): void {
  useEffect(() => {
    window.document.addEventListener('starmap:content:updated', () => {
      new Toast('Starmap Content Changed! Please Refresh.', {
        waitForEvent: true,
        style: {
          container: [
            ['cursor', 'pointer'],
          ]
        }
      })
    })
  }, []);
};
