import { chromium, FullConfig } from '@playwright/test';
import context from 'launchdarkly-react-client-sdk/lib/context';

async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const url = process.env.PLAYWRIGHT_HOPPER_HOME;
    page.locator('[placeholder="your password"]');
    const user = process.env.PLAYWRIGHT_DEFAULT_USER;
    const password = process.env.PLAYWRIGHT_DEFAULT_USER_PASSWORD;
    await page.goto(url as string);
    await page.locator('[placeholder="yours\\@example\\.com"]').fill(user as string);
    await page.locator('[placeholder="your password"]').fill(password as string);
    await page.locator('[aria-label="Log In"]').click();
    page.waitForURL;
    // Save signed-in state to 'storageState.json'.
    console.log("Saving storage state");
    await page.context().storageState({ path: 'storageState.json' });
    await browser.close();
    console.log("finished setup");

}

export default globalSetup;