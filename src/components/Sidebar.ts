import { expect, type Page } from '@playwright/test';

export type MainMenu = 'Admin' | 'PIM' | 'Leave' | 'Time' | 'Recruitment' | 'My Info' | 'Performance' | 'Dashboard';

export class Sidebar {
  constructor(private readonly page: Page) {}

  async open(menu: MainMenu) {
    await this.page.locator('.oxd-main-menu').getByRole('link', { name: menu, exact: true }).click();
    await expect(this.page.locator('.oxd-topbar-header-breadcrumb')).toContainText(menu);
  }
}
