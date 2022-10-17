/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@primer/react']);
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

module.exports = withTM({
  ...nextConfig,

  webpack(config, options) {
    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = true;
    // config.optimization = {
    //   providedExports: false,
    // };
    // options.nextRuntime = 'edge';

    return config;
  },
});
