const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const customJestConfig = {
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testMatch: ["**/test/**/*.test.(ts|js)"],
  testEnvironment: "node",

  // Attempt to fix rare test errors by ensuring that we don't run tests in parallel
  maxWorkers: 1,
};
module.exports = createJestConfig(customJestConfig);
