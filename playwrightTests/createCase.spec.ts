import { test, expect, Page } from '@playwright/test';
import { createPatientCase } from './dataGenerator';
import { DashboardPage } from './dashboardPage';

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        const dashboard = new DashboardPage(page);
        await dashboard.login();
        page.waitForURL;
        page.waitForLoadState;
    });

    test.only('Submitting a Created Case', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        const { firstName, lastName, birthDay, procedureDate } = createPatientCase();
        
        await dashboard.createCaseButton.click();
        await expect(dashboard.patientInformation).toBeVisible();
        await page.locator("[id='patient.firstName']").fill(firstName);
        await page.locator("[id='patient.lastName']").fill(lastName);
        await page.locator("[id='patient.dateOfBirth']").fill(birthDay);
        await page.locator("[id='case.location']").fill("Sacred Heart Hospital");
        await page.locator("[id='case.procedureUnit']").fill("Room 1A");
        await page.locator("[id='case.serviceLine']").fill("8675309");
        await page.locator("[id='case.provider']").fill("Doctor Doctorson");
        await page.locator("[id='case.procedureDate']").fill(procedureDate);
        await dashboard.submitCreateCaseButton.click();
        await expect(dashboard.patientInformation).toBeHidden();

        const [res] = await Promise.all([
            page.waitForResponse(res => res.url().includes('/getCases') && res.url().includes('searchValue') && res.status() === 200),
            page.locator("[placeholder$='Search Name or Case ID']").fill(`${firstName} ${lastName}`)
           ]);
    
        await res.finished()
        const patientName = `${lastName}, ${firstName}`;
        const caseCardName = await dashboard.caseCardName();

        await expect(caseCardName).toEqual(patientName);
    });
});
