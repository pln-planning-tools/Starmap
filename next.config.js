/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  poweredByHeader: false,
  // experimental: { images: { layoutRaw: true } },
};

module.exports = {
  ...nextConfig,

  webpack(config, options) {
    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = true;

    return config;
  },
};
