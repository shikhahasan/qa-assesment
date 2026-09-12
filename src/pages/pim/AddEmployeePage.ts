import { expect } from '@playwright/test';
import type { NewEmployee } from '../../utils/dataFactory';
import { BasePage } from '../BasePage';

export class AddEmployeePage extends BasePage {
  readonly firstName = this.page.locator('input[name="firstName"]');
  readonly middleName = this.page.locator('input[name="middleName"]');
  readonly lastName = this.page.locator('input[name="lastName"]');
  readonly employeeId = this.field('Employee Id');
  readonly saveButton = this.page.getByRole('button', { name: 'Save' });
  readonly savedEmployeeName = this.page.locator('.orangehrm-edit-employee-name');

  async expectLoaded() {
    await expect(this.page).toHaveURL(/pim\/addEmployee/);
    await expect(this.firstName).toBeVisible();
  }
  async addEmployee(employee: NewEmployee): Promise<number> {
    await this.firstName.fill(employee.firstName);
    await this.middleName.fill(employee.middleName);
    await this.lastName.fill(employee.lastName);
    await expect(this.employeeId).not.toHaveValue('');
    await this.employeeId.fill(employee.employeeId);

    await this.saveButton.click();
    await this.expectToast('Successfully Saved');
    await this.page.waitForURL(/pim\/viewPersonalDetails\/empNumber\/\d+/);
    await expect(this.savedEmployeeName).toContainText(`${employee.firstName} ${employee.lastName}`);
    return Number(this.page.url().match(/empNumber\/(\d+)/)![1]);
  }
}
