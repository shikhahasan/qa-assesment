import { test as base, expect } from '@playwright/test';
import { OrangeHrmApi } from '../api/OrangeHrmApi';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { env } from '../config/env';
import { EditUserPage } from '../pages/admin/EditUserPage';
import { SystemUsersPage } from '../pages/admin/SystemUsersPage';
import { LoginPage } from '../pages/LoginPage';
import { AddEmployeePage } from '../pages/pim/AddEmployeePage';
import { EmployeeListPage } from '../pages/pim/EmployeeListPage';

interface Fixtures {
  loginPage: LoginPage;
  sidebar: Sidebar;
  topBar: TopBar;
  employeeListPage: EmployeeListPage;
  addEmployeePage: AddEmployeePage;
  systemUsersPage: SystemUsersPage;
  editUserPage: EditUserPage;
  /** Admin-authenticated API client (own session, independent of the browser). */
  api: OrangeHrmApi;
}

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  sidebar: async ({ page }, use) => use(new Sidebar(page)),
  topBar: async ({ page }, use) => use(new TopBar(page)),
  employeeListPage: async ({ page }, use) => use(new EmployeeListPage(page)),
  addEmployeePage: async ({ page }, use) => use(new AddEmployeePage(page)),
  systemUsersPage: async ({ page }, use) => use(new SystemUsersPage(page)),
  editUserPage: async ({ page }, use) => use(new EditUserPage(page)),

  api: async ({ playwright }, use) => {
    const request = await playwright.request.newContext({ baseURL: env.baseURL });
    const api = new OrangeHrmApi(request);
    await api.login(env.adminUsername, env.adminPassword);
    await use(api);
    await request.dispose();
  },
});

export { expect };
