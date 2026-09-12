import { test as base, expect } from '@playwright/test';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { LoginPage } from '../pages/LoginPage';

interface Fixtures {
  loginPage: LoginPage;
  sidebar: Sidebar;
  topBar: TopBar;
}

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  sidebar: async ({ page }, use) => use(new Sidebar(page)),
  topBar: async ({ page }, use) => use(new TopBar(page)),
});

export { expect };
