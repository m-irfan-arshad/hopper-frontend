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

    test('Submitting a Created Case', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        const createCaseButton = page.locator('button', { hasText: 'Create Case' });
        const patientInformation = page.locator("text='Patient Information'");
        const submitCreateCaseButton = page.locator("text='Create Case' >> nth=2");
        const { firstName, lastName, birthDay, procedureDate } = createPatientCase();
        
        await createCaseButton.click();
        await expect(patientInformation).toBeVisible();
        await page.locator("[id='patient.firstName']").fill(firstName);
        await page.locator("[id='patient.lastName']").fill(lastName);
        await page.locator("[id='patient.dateOfBirth']").fill(birthDay);
        await page.locator("[id='case.providerName']").fill("Doctor Doctorson");
        await page.locator("[id='case.locationName']").fill("Sacred Heart Hospital");
        await page.locator("[id='case.procedureUnit']").fill("Room 1A");
        await page.locator("[id='case.serviceLine']").fill("8675309");
        await page.locator("[id='case.procedureDate']").fill(procedureDate);
        await submitCreateCaseButton.click();
        await expect(patientInformation).toBeHidden();

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
