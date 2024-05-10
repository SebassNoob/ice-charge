/** @type {import('next').NextConfig} */
const path = require("path");

const aliases = {
  "@": "./src",
  "@components": "./src/components",
  "@providers": "./src/providers",
  "@utils": "./src/utils",
};

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // except for webpack, other parts are left as generated
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      ...Object.entries(aliases).reduce((acc, [key, value]) => {
        acc[key] = path.resolve(value);
        return acc;
      }, {}),
    };
    return config;
  },
};

module.exports = nextConfig;
