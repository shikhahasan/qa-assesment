import { expect, type Locator, type Page } from '@playwright/test';
import { exactText } from '../utils/text';

export class TopBar {
  readonly userMenu: Locator;
  readonly userName: Locator;

  constructor(private readonly page: Page) {
    this.userMenu = page.locator('.oxd-userdropdown-tab');
    this.userName = page.locator('.oxd-userdropdown-name');
  }

  async openTab(name: string) {
    await this.page.locator('.oxd-topbar-body-nav-tab-item', { hasText: exactText(name) }).click();
  }

  async logout() {
    await this.userMenu.click();
    await this.page.locator('.oxd-userdropdown-link', { hasText: 'Logout' }).click();
    await expect(this.page).toHaveURL(/auth\/login/);
  }
}
