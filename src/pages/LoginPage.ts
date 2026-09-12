import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly username = this.page.getByPlaceholder('Username');
  readonly password = this.page.getByPlaceholder('Password');
  readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  readonly errorAlert = this.page.locator('.oxd-alert-content-text');

  async goto() {
    await this.page.goto('auth/login');
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async loginAs(username: string, password: string) {
    await this.goto();
    await this.login(username, password);
    await expect(this.page).toHaveURL(/dashboard\/index/);
    await expect(this.topBar.userName).toBeVisible();
  }

  async expectError(message: string) {
    await expect(this.errorAlert).toHaveText(message);
  }
}
