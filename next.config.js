/** @type {import('next').NextConfig} */

const nowDate = new Date();
const buildTimestamp = nowDate.getTime();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    buildTimestamp,
    FAUNADB_API_KEY: process.env.FAUNADB_API_KEY,
    FAUNADB_API_BASE_URL: process.env.FAUNADB_API_BASE_URL,
  },

};

module.exports = nextConfig;
