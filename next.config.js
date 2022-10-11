// /** @type {import('next').NextConfig} */
const nowDate = new Date();
const buildTimestamp = nowDate.getTime();
const buildId = process.env.BUILD_ID;
const publishVersion = process.env.npm_package_version;
const commitRef =
  process.env.COMMIT_REF || "COMMIT_REF not defined in this env";
const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true, // TODO
  },
  productionBrowserSourceMaps: true,
  publicRuntimeConfig: {
    isProduction,
    baseUrl: process.env.BASE_URL,
    originUrl: process.env.ORIGIN_URL,
    buildTimestamp,
    buildId,
    buildHash: process.env.BUILD_SHA1,
    publishVersion,
    commitRef,
    THENTIC_API_BASE_URL: process.env.THENTIC_API_BASE_URL,
  },
};

module.exports = nextConfig;
