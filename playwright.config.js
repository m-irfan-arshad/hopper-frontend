// @ts-check
require('dotenv').config();
const { devices } = require('@playwright/test');
const config = {
  testDir: './playwrightTests',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000

  },
  use: {
    baseURL: process.env.PLAYWRIGHT_HOPPER_HOME
  },

  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  projects: [
    {
      name: 'safari',
      use: {
        browserName: 'webkit',
        headless: true,
        //screenshots every step
        screenshot: 'on',
        //traces and logs every step
        trace: 'retain-on-failure'
      }
    },
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        headless: true,
        //screenshots every step
        screenshot: 'on',
        //traces and logs every step
        trace: 'retain-on-failure'
      }
    }
  ],
};
module.exports = config;