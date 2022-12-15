import { test, expect } from '@playwright/test';
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
        const createCaseButton = page.locator('button', { hasText: 'Create Case' });
        const patientInformation = page.locator("text='Patient Information'");
        const submitCreateCaseButton = page.locator("text='Create Case' >> nth=2");
        const { firstName, lastName, birthDay, procedureDate } = createPatientCase();
        await page.waitForTimeout(800);
        await createCaseButton.click();
        await expect(patientInformation).toBeVisible();
        await page.locator("[id='patient.firstName']").type(firstName);
        await page.locator("[id='patient.lastName']").type(lastName);
        await page.locator("[id='patient.dateOfBirth']").type(birthDay);
        await page.locator("[id='case.providerName']").type("Doctor Doctorson");
        await page.locator("[id='case.locationName']").type("Sacred Heart Hospital");
        await page.locator("[id='case.procedureUnit']").type("Room 1A");
        await page.locator("[id='case.serviceLine']").type("8675309");
        await page.locator("[id='case.procedureDate']").type(procedureDate);
        await page.waitForTimeout(800);
        await submitCreateCaseButton.click();
        await expect(patientInformation).toBeHidden();
        await page.locator("[placeholder$='Search Name or Case ID']").type(firstName)
        await page.waitForTimeout(800);
        const patientName= lastName + ", " + firstName
        const returnName=await page.locator(".MuiTypography-root.MuiTypography-subtitle1.css-1eje5hw").textContent()
        await expect(returnName).toEqual(patientName);
        
         
    });
});
