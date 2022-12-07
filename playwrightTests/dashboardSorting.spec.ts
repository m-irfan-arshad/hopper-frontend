import moment from "moment";
import { test, expect } from '@playwright/test';
import { DashboardPage } from './dashboardPage';

test.describe('Landing Page Features', () => {
    test.beforeEach(async ({ page }) => {
        const dashboard = new DashboardPage(page);
        await dashboard.login();
        page.waitForURL;
        page.waitForLoadState;
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
        const sortOne = page.locator("#menu->>text='Oldest - Newest'");
        const sortTwo = page.locator("#menu->>text='Newest - Oldest'");
        await sortDropDownArrow.click();
        page.waitForLoadState;
        await expect(sortOne).toContainText('Oldest - Newest');
        await sortOne.click();
        page.waitForLoadState;
        const sortOneDropDownArrowDisplay = page.locator("#case-sort-select");
        await expect(sortOneDropDownArrowDisplay).toContainText('Sort: Oldest - Newest');
        await sortDropDownArrow.click();
        page.waitForLoadState;
        await expect(sortTwo).toContainText('Newest - Oldest');
        await sortTwo.click();
        page.waitForLoadState;
        const sortTwoDropDownArrowDisplay = page.locator("#case-sort-select");
        await expect(sortTwoDropDownArrowDisplay).toContainText('Sort: Newest - Oldest');
    });

    test('Validating Date Range Drop Down Elements', async ({ page }) => {
        const dateOne = page.locator("#menu->>text='This month'");
        const dateTwo = page.locator("#menu->>text='Next month'");
        const dateThree = page.locator("#menu->>text='Next quarter'");
        const dateDropDownArrow = page.locator("#case-date-select");
        // await page.waitForTimeout(800);
        await expect(dateDropDownArrow).toContainText('This month');
        await dateDropDownArrow.click();
        page.waitForLoadState;
        // page.waitForURL;
        // page.waitForLoadState;
        await expect(dateOne).toContainText('This month');
        await expect(dateTwo).toContainText('Next month');
        await expect(dateThree).toContainText('Next quarter');
        // page.waitForURL;
        // page.waitForLoadState;
        await dateThree.click();
        page.waitForLoadState;
        await expect(dateDropDownArrow).toContainText('Date Range: Next quarter');
    });

    test('Validating Step Drop Down Elements', async ({ page }) => {
        const stepOne = page.locator("#menu->>text='All Steps'");
        const stepTwo = page.locator("#menu->>text='Insurance Authorization'");
        // const stepThree = page.locator("#menu->>text='Vendor Confirmation'");
        const stepDropDownArrow = page.locator("#case-step-select");
        await expect(stepDropDownArrow).toContainText('All Steps');
        // page.waitForURL;
        // page.waitForLoadState;
        await stepDropDownArrow.click();
        page.waitForLoadState;
        await expect(stepOne).toContainText('All Steps');
        await expect(stepTwo).toContainText('Insurance Authorization');
        // page.waitForURL;
        // page.waitForLoadState;
        await stepTwo.click();
        page.waitForLoadState;
        await expect(stepDropDownArrow).toContainText('Step: Insurance Authorization');
    });

});
