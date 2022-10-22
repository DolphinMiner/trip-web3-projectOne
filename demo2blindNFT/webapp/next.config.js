/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PROVIDER_MODE: process.env.PROVIDER_MODE,
    ALCHEMY_PROJECT_KEY: process.env.ALCHEMY_PROJECT_KEY,
  },
}

module.exports = nextConfig
