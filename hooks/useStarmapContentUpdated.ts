import { useEffect } from 'react';
import Toast from 'awesome-toast-component'

export default function useStarmapContentUpdated (): void {
  useEffect(() => {
    window.document.addEventListener('starmap:content:updated', () => {
      new Toast('Starmap Updated! Click here to refresh the page.', {
        waitForEvent: true,
        afterHide: () => window.location.reload(),
        style: {
          container: [
            ['cursor', 'pointer'],
          ]
        }
      })
    })
  }, []);
};
