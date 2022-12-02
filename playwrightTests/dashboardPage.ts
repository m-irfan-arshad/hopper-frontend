import { expect, Locator, Page } from '@playwright/test';


export class DashboardPage {

    readonly page: Page;
    readonly patientCardArrow: Locator;
    readonly caseDateGroup: Locator;
    readonly procedureDate: Locator;
    readonly userName: Locator;
    readonly password: Locator;
    readonly logInButton: Locator;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.patientCardArrow = page.locator('data-testid=ArrowDropDownOutlinedIcon');
        this.caseDateGroup = page.locator('data-testid=caseDateGroup');
        this.procedureDate = page.locator('data-testid=procedureDate');
        this.userName = page.locator('#username');
        this.password = page.locator('#password');
        this.logInButton = page.locator("button[value='default']");
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

    async logIn() {
        const url = process.env.PLAYWRIGHT_HOPPER_HOME;
        const user = process.env.PLAYWRIGHT_DEFAULT_USER;
        const password = process.env.PLAYWRIGHT_DEFAULT_USER_PASSWORD;
        await this.page.goto(url as string);
        await this.userName.type(user as string);
        await this.password.type(password as string);
        await this.logInButton.click()
    }

}