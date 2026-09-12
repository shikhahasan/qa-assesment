import { expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export type UserRole = 'Admin' | 'ESS';
export type UserStatus = 'Enabled' | 'Disabled';

export class EditUserPage extends BasePage {
  readonly username = this.field('Username');
  readonly saveButton = this.page.getByRole('button', { name: 'Save' });

  async expectLoaded() {
    await expect(this.page).toHaveURL(/admin\/saveSystemUser\/\d+/);
    await this.waitForLoaders();
    await expect(this.username).not.toHaveValue('');
  }

  async setRole(role: UserRole) {
    await this.selectOption('User Role', role);
  }

  async setStatus(status: UserStatus) {
    await this.selectOption('Status', status);
  }

  async save() {
    await this.saveButton.click();
    await this.expectToast('Successfully Updated');
    await this.page.waitForURL(/admin\/viewSystemUsers/);
  }
}
