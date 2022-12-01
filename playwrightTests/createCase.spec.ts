import { test, expect } from '@playwright/test';
import { createPatientCase } from './dataGenerator';
import { DashboardPage } from './dashboardPage';

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page, baseURL }) => {
        const dashboard = new DashboardPage(page);
        await page.goto(baseURL!);
        await dashboard.logIn();
    });

    test('Validating Create Case Modal=', async ({ page }) => {
        const createCaseButton = page.locator('button', { hasText: 'Create Case' });
        const patientInformation = page.locator("text='Patient Information'");
        const cancelButton = page.locator('button', { hasText: 'Cancel' });
        const { firstName, lastName, birthDay } = createPatientCase();
        await createCaseButton.click();
        await expect(patientInformation).toBeVisible();
        await page.locator("[id='patient.firstName']").type(firstName);
        await page.locator("[id='patient.lastName']").type(lastName);
        await page.locator("[id='patient.dateOfBirth']").type(birthDay);
        await cancelButton.click();
        await expect(patientInformation).toBeHidden();
    });
});
