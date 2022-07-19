const moment = require('moment');

const { test, expect } = require('@playwright/test');
const { display } = require('@mui/system');
const { contains } = require('ramda');
test('Validating Patient Card Fields', async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const dropDownArrow = page.locator(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-11ecxny");
    await page.goto(baseURL);
    await dropDownArrow.nth(0).click();
    const procedureDateTitle = await page.locator(".MuiTypography-root.MuiTypography-body1.css-2ywn4m").nth(0).textContent();
    const procedureLocation = await page.locator(".MuiTypography-root.MuiTypography-body1.css-2ywn4m").nth(1).textContent();
    const procedureCaseID = await page.locator(".MuiTypography-root.MuiTypography-body1.css-2ywn4m").nth(2).textContent();
    const procedureMRN = await page.locator(".MuiTypography-root.MuiTypography-body1.css-2ywn4m").nth(3).textContent();
    const procedureProceduralist = await page.locator(".MuiTypography-root.MuiTypography-body1.css-2ywn4m").nth(4).textContent();
    const procedureQuickActions = await page.locator(".MuiTypography-root.MuiTypography-body1.css-2ywn4m").nth(5).textContent();
    expect(procedureDateTitle == "Procedure Date").toBeTruthy();
    expect(procedureLocation == "Procedure Location").toBeTruthy();
    expect(procedureCaseID == "Case ID").toBeTruthy();
    expect(procedureMRN == "MRN").toBeTruthy();
    expect(procedureProceduralist == "Proceduralist").toBeTruthy();
    expect(procedureQuickActions == "Quick Actions").toBeTruthy();

});
test('Validating Procedure Date Sorting', async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const dropDownArrow = page.locator(".MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-11ecxny");
    await page.goto(baseURL);
    const procedureDateGroup = await page.locator(".MuiTypography-root.MuiTypography-body1.css-1b85sqj").nth(0).textContent();
    await dropDownArrow.nth(0).click();
    const procedureDate = await page.locator(".MuiTypography-root.MuiTypography-body1.css-1e17j98").nth(0).textContent();
    const procedureDateFormatted = moment.utc(procedureDate).format("MM-DD-YYYY");
    const procedureDateGroupFormatted = moment.utc(procedureDateGroup).format("MM-DD-YYYY");
    expect(procedureDateFormatted == procedureDateGroupFormatted).toBeTruthy();
});

test('Validating Sort Drop Down Elements', async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const sortDropDownArrow = page.locator("#case-sort-select");
    const sortOne = page.locator("#menu->>text='Sort: Oldest - Newest'");
    const sortTwo = page.locator("#menu->>text='Sort: Newest - Oldest'");

    await page.goto(baseURL);
    const sortOneContent = await sortOne.textContent();
    expect(sortOneContent == "Sort: Oldest - Newest").toBeTruthy();
    await sortOne.click();
    const sortOneDropDownArrowDisplay = await page.locator("#case-sort-select").textContent();
    expect(sortOneContent == sortOneDropDownArrowDisplay).toBeTruthy();
    await sortDropDownArrow.click();
    const sortTwoContent = await sortTwo.textContent();
    expect(sortTwoContent == "Sort: Newest - Oldest").toBeTruthy();
    await sortTwo.click();
    const sortTwoDropDownArrowDisplay = await page.locator("#case-sort-select").textContent();
    expect(sortTwoContent == sortTwoDropDownArrowDisplay).toBeTruthy();

});

test.only('Validating Date Range Drop Down Elements', async ({ browser, baseURL }) => {

    const context = await browser.newContext();
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const page = await context.newPage();
    const dateDropDownArrow = page.locator("#case-date-select");
    // const dateOne = page.locator("#menu->>text='Date Range: This month'");
    // const dateTwo = page.locator("#menu->>text='Date Range: Next month'");
    const dateThree = page.locator("#menu->>text='Date Range: Next quarter'");

    await page.goto(baseURL);
    // await delay(500)
    await dateDropDownArrow.click();
    // const dateOneContent = await dateOne.textContent();
    // const dateTwoContent = await dateTwo.textContent();
    const dateThreeContent = await dateThree.textContent();
    // expect(dateOneContent == "Date Range: This month").toBeTruthy();
    // expect(dateTwoContent == "Date Range: Next month").toBeTruthy();
    expect(dateThreeContent == "Date Range: Next quarter").toBeTruthy();
    //await delay(500)
    await dateThree.click();
    const dateThreeDropDownArrowDisplay = await page.locator("#case-date-select").textContent();
    expect(dateThreeContent == dateThreeDropDownArrowDisplay).toBeTruthy();

});

test('Validating Step Drop Down Elements', async ({ browser, baseURL }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const stepOne = page.locator("#menu->>text='Step: All Steps'");
    const stepTwo = page.locator("#menu->>text='Step: Insurance Authorization'");
    const stepThree = page.locator("#menu->>text='Step: Pre Surgical Testing'");

    await page.goto(baseURL);
    const stepDropDownArrow = page.locator("#case-step-select");
    await page.locator("#case-step-select").waitFor();
    await delay(500)
    await stepDropDownArrow.click();
    const stepOneContent = await stepOne.textContent();
    const stepTwoContent = await stepTwo.textContent();
    const stepThreeContent = await stepThree.textContent();
    //await delay(1000)
    expect(stepOneContent == "Step: All Steps").toBeTruthy();
    expect(stepTwoContent == "Step: Insurance Authorization").toBeTruthy();
    expect(stepThreeContent == "Step: Pre Surgical Testing").toBeTruthy();
    //page.waitForTimeout
    //console.log(stepThreeContent);
    // await stepDropDownArrow.click();
    await stepThree.click();
    const stepThreeDropDownArrowDisplay = await page.locator("#case-step-select").textContent();
    expect(stepThreeContent == stepThreeDropDownArrowDisplay).toBeTruthy();

});

