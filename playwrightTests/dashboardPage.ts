import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {

    readonly page: Page;
    readonly patientCardArrow: Locator;
    readonly caseDateGroup: Locator;
    readonly procedureDate: Locator;


    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.patientCardArrow = page.locator('data-testid=ArrowDropDownOutlinedIcon');
        this.caseDateGroup = page.locator('data-testid=caseDateGroup');
        this.procedureDate = page.locator('data-testid=procedureDate')
    }

    async openFirstPatientDropDown() {
        await this.patientCardArrow.first().click();
    }

    async caseDateGroupContent() {
        return await this.caseDateGroup.first().textContent();
    }

    async procedureDateContent() {
        return await this.procedureDate.textContent();
    }

}