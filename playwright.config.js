// @ts-check
const { devices } = require('@playwright/test');
const config = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
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