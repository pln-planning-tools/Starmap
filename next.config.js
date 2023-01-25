/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { StaleWhileRevalidate } = require('workbox-strategies')
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [new StaleWhileRevalidate()]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    dangerouslyAllowSVG: true,
  },
};

module.exports = withPWA({
  ...nextConfig,
  productionBrowserSourceMaps: true,

  webpack(config) {
    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = true;

    return config;
  }
});
