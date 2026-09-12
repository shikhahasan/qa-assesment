import { expect } from '@playwright/test';
import { DataTable } from '../../components/DataTable';
import { BasePage } from '../BasePage';

export class EmployeeListPage extends BasePage {
  readonly table = new DataTable(this.page);
  readonly addButton = this.page.getByRole('button', { name: 'Add' });
  readonly searchButton = this.page.getByRole('button', { name: 'Search' });

  async expectLoaded() {
    await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);
    await expect(this.table.root).toBeVisible();
  }

  /** Types into the "Employee Name" autocomplete, picks the matching suggestion and searches. */
  async searchByName(name: string) {
    await this.field('Employee Name').fill(name);
    await this.page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option', { hasText: name }).first().click();
    await this.search();
  }

  async searchById(employeeId: string) {
    await this.field('Employee Id').fill(employeeId);
    await this.search();
  }

  async search() {
    await this.clickAndWaitForApi(this.searchButton, '/api/v2/pim/employees');
  }
}
