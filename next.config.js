/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  swSrc: 'sw/service-worker.ts',
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
