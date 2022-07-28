import moment from "moment";
import { test, expect } from '@playwright/test';
import { DashboardPage } from './dashboardPage';

test.describe('Landing Page Features', () => {
    test.beforeEach(async ({ page, baseURL }) => {
        await page.goto(baseURL!);
    });

    test('Validating Procedure Date Sorting', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        await dashboard.openFirstPatientDropDown();
        const caseDateGroup = await dashboard.caseDateGroupContent();
        const procedureDate = await dashboard.procedureDateContent();
        const procedureDateFormatted = moment.utc(procedureDate).format("MM-DD-YYYY");
        const caseDateGroupFormatted = moment.utc(caseDateGroup).format("MM-DD-YYYY");
        expect(procedureDateFormatted).toEqual(caseDateGroupFormatted);
    });

    test('Validating Sort Drop Down Elements', async ({ page }) => {
        const sortDropDownArrow = page.locator("#case-sort-select");
        const sortOne = page.locator("#menu->>text='Sort: Oldest - Newest'");
        const sortTwo = page.locator("#menu->>text='Sort: Newest - Oldest'");

        await sortDropDownArrow.click();
        await expect(sortOne).toContainText('Sort: Oldest - Newest');
        await sortOne.click();
        const sortOneDropDownArrowDisplay = page.locator("#case-sort-select");
        await expect(sortOneDropDownArrowDisplay).toContainText('Sort: Oldest - Newest');
        await sortDropDownArrow.click();
        await expect(sortTwo).toContainText('Sort: Newest - Oldest');
        await sortTwo.click();
        const sortTwoDropDownArrowDisplay = page.locator("#case-sort-select");
        await expect(sortTwoDropDownArrowDisplay).toContainText('Sort: Newest - Oldest');
    });

    test('Validating Date Range Drop Down Elements', async ({ page }) => {

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const dateOne = page.locator("#menu->>text='Date Range: This month'");
        const dateTwo = page.locator("#menu->>text='Date Range: Next month'");
        const dateThree = page.locator("#menu->>text='Date Range: Next quarter'");
        const dateDropDownArrow = page.locator("#case-date-select");

        await page.waitForSelector("#case-date-select");
        await delay(500);
        await dateDropDownArrow.click();
        await expect(dateOne).toContainText('Date Range: This month');
        await expect(dateTwo).toContainText('Date Range: Next month');
        await expect(dateThree).toContainText('Date Range: Next quarter');
        await dateThree.click();
        await expect(dateDropDownArrow).toContainText('Date Range: Next quarter');

    });

    test('Validating Step Drop Down Elements', async ({ page }) => {

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const stepOne = page.locator("#menu->>text='Step: All Steps'");
        const stepTwo = page.locator("#menu->>text='Step: Insurance Authorization'");
        const stepThree = page.locator("#menu->>text='Step: Pre Surgical Testing'");
        const stepDropDownArrow = page.locator("#case-step-select");

        await delay(800)
        await stepDropDownArrow.click();
        await expect(stepOne).toContainText('Step: All Steps');
        await expect(stepTwo).toContainText('Step: Insurance Authorization');
        await expect(stepThree).toContainText('Step: Pre Surgical Testing');
        await stepThree.click();
        await expect(stepDropDownArrow).toContainText('Step: Pre Surgical Testing');

    });
});
