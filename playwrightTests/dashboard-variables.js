const { expect } = require('@playwright/test');

exports.DashboardVariables = class DashboardVariables {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.patientCardArrow = page.locator('[data-testid=ArrowDropDownOutlinedIcon]');
    this.procedureDateGroup = page.locator(".MuiTypography-root.MuiTypography-body2");
    this.procedureDate = page.locator(".MuiTypography-root.MuiTypography-body1")
  }

  async openFirstPatientDropDown() {
    await this.patientCardArrow.first().nth(0).click();
  }

  async procedureDateGroupContent() {
    return await this.procedureDateGroup.nth(0).textContent();
  }

  async procedureDateContent() {
    return await this.procedureDate.nth(2).textContent();
  }

}