const { test, expect } = require('@playwright/test');
test.only('Validating Patient Card Fields', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const dropDownArrow = page.locator(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-14h0jh8");
    await page.goto("https://hopper-frontend-cxk56rs2hq-uc.a.run.app//");
    await dropDownArrow.nth(0).click();
    const procedureDateTitle= await page.locator(".MuiTypography-root.MuiTypography-body1.css-14ti4ws").nth(0).textContent();
    const procedureLocation= await page.locator(".MuiTypography-root.MuiTypography-body1.css-14ti4ws").nth(1).textContent();
    const procedureCaseID= await page.locator(".MuiTypography-root.MuiTypography-body1.css-14ti4ws").nth(2).textContent();
    const procedureMRN= await page.locator(".MuiTypography-root.MuiTypography-body1.css-14ti4ws").nth(3).textContent();
    const procedureProceduralist= await page.locator(".MuiTypography-root.MuiTypography-body1.css-14ti4ws").nth(4).textContent();
    const procedureQuickActions= await page.locator(".MuiTypography-root.MuiTypography-body1.css-14ti4ws").nth(5).textContent();
    expect (procedureDateTitle == "Procedure Date").toBeTruthy();
    expect (procedureLocation == "Procedure Location").toBeTruthy();
    expect (procedureCaseID == "Case ID").toBeTruthy();
    expect (procedureMRN == "MRN").toBeTruthy();
    expect (procedureProceduralist == "Proceduralist").toBeTruthy();
    expect (procedureQuickActions == "Quick Actions").toBeTruthy();

});