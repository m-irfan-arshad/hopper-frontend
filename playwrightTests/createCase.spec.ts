import { test, expect, Page } from '@playwright/test';
import { createPatientCase } from './dataGenerator';
import { DashboardPage } from './dashboardPage';

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        const dashboard = new DashboardPage(page);
        await page.goto(dashboard.url);
    });

    test('Submitting a Created Case', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        const { firstName, lastName, birthDay, procedureDate } = createPatientCase();

        await dashboard.createCaseButton.click();
        await expect(dashboard.patientInformation).toBeVisible();
        await page.locator("[id='patient.firstName']").fill(firstName);
        await page.locator("[id='patient.lastName']").fill(lastName);
        await page.locator("[id='patient.dateOfBirth']").fill(birthDay);
        await page.locator("[id='scheduling.location']").click();
        await page.locator("text='Healthy Heart Hospital'").click();
        await page.locator("[id='scheduling.procedureUnit']").click();
        await page.locator("text='OR'").click();
        await page.locator("[id='scheduling.serviceLine']").click();
        await page.locator("text='Orthopedics'").click();
        await page.locator("[id='scheduling.provider']").click();
        await page.locator("text='Sauce Gardner'").click();
        await page.locator("[id='scheduling.procedureDate']").fill(procedureDate);
        await dashboard.submitCreateCaseButton.click();
        await expect(dashboard.patientInformation).toBeHidden();

        const [res] = await Promise.all([
            page.waitForResponse(res => res.url().includes('/getCases') && res.url().includes('searchValue') && res.status() === 200),
            page.locator("[placeholder$='Search Patient Name']").fill(`${firstName} ${lastName}`)
        ]);

        await res.finished()
        const patientName = `${lastName}, ${firstName}`;
        const caseCardName = await dashboard.caseCardName();
        await expect(caseCardName).toEqual(patientName);
        // await dashboard.openFirstPatientDropDown();
        // const caseIdNumber = await dashboard.caseIdNumber();
        // await page.reload();
        // const [res2] = await Promise.all([
        //     page.waitForResponse(res2 => res2.url().includes('/getCases') && res2.url().includes('searchValue') && res2.status() === 200),
        //     page.locator("[placeholder$='Search Patient Name']").fill(`${caseIdNumber}`)
        // ]);

        // await res2.finished()
        // const caseCardName2 = await dashboard.caseCardName();
        // await expect(caseCardName2).toEqual(patientName);

    });
});
