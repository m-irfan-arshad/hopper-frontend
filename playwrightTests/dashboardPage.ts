import { Locator, Page } from '@playwright/test';


export class DashboardPage {

    readonly page: Page;
    readonly patientCardArrow: Locator;
    readonly caseCardPatientName: Locator;
    readonly caseDateGroup: Locator;
    readonly procedureDate: Locator;
    readonly userName: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly createCaseButton: Locator;
    readonly patientInformation: Locator;
    readonly submitCreateCaseButton: Locator;
    readonly caseId: Locator;
    readonly url: string;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.patientCardArrow = page.locator('data-testid=ArrowDropDownOutlinedIcon');
        this.caseCardPatientName = page.locator('data-testid=caseCardPatientName');
        this.caseDateGroup = page.locator('data-testid=caseDateGroup');
        this.procedureDate = page.locator('data-testid=procedureDate');
        this.userName = page.locator('[placeholder="yours\\@example\\.com"]');
        this.password = page.locator('[placeholder="your password"]');
        this.loginButton = page.locator('[aria-label="Log In"]');
        this.createCaseButton = page.locator('button', { hasText: 'Create Case' });
        this.patientInformation = page.locator("text='Patient Information'");
        this.submitCreateCaseButton = page.locator("text='Create Case' >> nth=2");
        this.caseId = page.locator('data-testid=caseId');
        this.url = process.env.PLAYWRIGHT_HOPPER_HOME!;
    }

    async openFirstPatientDropDown() {
        await this.patientCardArrow.first().click();
    }

    async caseDateGroupContent() {
        return await this.caseDateGroup.first().textContent();
    }

    async caseCardName() {
        return await this.caseCardPatientName.first().textContent();
    }

    async procedureDateContent() {
        return await this.procedureDate.textContent();
    }

    async caseIdNumber() {
        return await this.caseId.textContent();
    }

    async login() {
        const url = process.env.PLAYWRIGHT_HOPPER_HOME;
        const user = process.env.PLAYWRIGHT_DEFAULT_USER;
        const password = process.env.PLAYWRIGHT_DEFAULT_USER_PASSWORD;
        await this.page.goto(url as string);
        await this.userName.fill(user as string);
        await this.password.fill(password as string);
        await this.loginButton.click()
    }

}