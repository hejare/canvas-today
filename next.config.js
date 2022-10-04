/** @type {import('next').NextConfig} */

const nowDate = new Date();
const buildTimestamp = nowDate.getTime();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    buildTimestamp,
    SLACK_API_KEY: process.env.SLACK_API_KEY,
    SLACK_API_BASE_URL: process.env.SLACK_API_BASE_URL,
    REPLICATE_API_KEY: process.env.REPLICATE_API_KEY,
    REPLICATE_API_BASE_URL: process.env.REPLICATE_API_BASE_URL,
    REPLICATE_MODEL_VERSION: process.env.REPLICATE_MODEL_VERSION,
  },

}

module.exports = nextConfig
