/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  poweredByHeader: false,
  images: {
    dangerouslyAllowSVG: true,
  },
  // experimental: {
  //   esmExternals: false,
  // },
};

module.exports = {
  ...nextConfig,
  productionBrowserSourceMaps: true,

  webpack(config, options) {
    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = true;
    // config.optimization = {
    //   providedExports: false,
    // };
    // options.nextRuntime = 'edge';

    return config;
  },
};
