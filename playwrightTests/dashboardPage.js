const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
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