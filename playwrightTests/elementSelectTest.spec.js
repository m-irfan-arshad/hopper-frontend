const { test, expect } = require('@playwright/test');
test.only('Hopper Playwright Test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const timeFilter = page.locator("tr:nth-child(1) > th:nth-child(2) > span:nth-child(1)");
    await page.goto("https://hopper-frontend-idndrnvzqa-uc.a.run.app/");
    const text = await timeFilter.textContent();
    console.log(text);
    await timeFilter.click();
});