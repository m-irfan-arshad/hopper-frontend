import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page, baseURL }) => {
        await page.goto(baseURL!);
    });

    test('Validating Create Case Modal=', async ({ page }) => {
        const createCaseButton = page.locator("text='Create Case'");
        const patientInformation = page.locator("text='Patient Information'");
        const cancelButton = page.locator("text='Cancel'");
        await createCaseButton.click();
        await expect(patientInformation).toBeVisible();
        await cancelButton.click();
        await expect(patientInformation).toBeHidden();
    });
});
