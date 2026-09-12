import { expect, type Locator } from '@playwright/test';
import { DataTable } from '../../components/DataTable';
import { exactText } from '../../utils/text';
import { BasePage } from '../BasePage';

/** Admin → User Management → Users. */
export class SystemUsersPage extends BasePage {
  readonly table = new DataTable(this.page);
  readonly searchButton = this.page.getByRole('button', { name: 'Search' });

  async expectLoaded() {
    await expect(this.page).toHaveURL(/admin\/viewSystemUsers/);
    await expect(this.table.root).toBeVisible();
  }

  async searchByUsername(username: string) {
    await this.field('Username').fill(username);
    await this.clickAndWaitForApi(this.searchButton, '/api/v2/admin/users');
  }

  rowFor(username: string): Locator {
    return this.table.rows.filter({
      has: this.page.locator('.oxd-table-cell', { hasText: exactText(username) }),
    });
  }

  async openEdit(username: string) {
    await this.rowFor(username).locator('button:has(.bi-pencil-fill)').click();
  }
}
