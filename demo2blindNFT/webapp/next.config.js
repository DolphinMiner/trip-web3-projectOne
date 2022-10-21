/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PROVIDER_MODE: process.env.PROVIDER_MODE || 'goerli',
    ALCHEMY_PROJECT_KEY: process.env.ALCHEMY_PROJECT_KEY || '7r-turYGetpoFiHL-zHWwT77tt8Eja0k',
  },
}

module.exports = nextConfig
