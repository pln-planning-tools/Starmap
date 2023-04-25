navigator.serviceWorker.addEventListener('message', async event => {
  if (event.data.meta === 'workbox-broadcast-update') {
    const { cacheName, updatedURL } = event.data.payload;

    document.dispatchEvent(new CustomEvent('starmap:content:updated', { detail: { cacheName, updatedURL } }));
  }
});
