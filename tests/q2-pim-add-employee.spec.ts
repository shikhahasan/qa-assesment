import { env } from '../src/config/env';
import { expect, test } from '../src/fixtures/test';
import { fullName, newEmployee } from '../src/utils/dataFactory';

test.describe('Q2 - PIM: add employee and find it in Employee List', { tag: '@q2' }, () => {
  let createdEmpNumber: number | undefined;

  test.afterEach(async ({ api }) => {
    if (createdEmpNumber) await api.deleteEmployees([createdEmpNumber]);
    createdEmpNumber = undefined;
  });

  test('add an employee with random data, search for it, then log out', async ({
    loginPage,
    sidebar,
    topBar,
    employeeListPage,
    addEmployeePage,
  }) => {
    const employee = newEmployee();

    await test.step('Log in as admin', () => loginPage.loginAs(env.adminUsername, env.adminPassword));

    await test.step('Navigate to PIM', async () => {
      await sidebar.open('PIM');
      await employeeListPage.expectLoaded();
    });

    await test.step(`Add employee "${fullName(employee)}"`, async () => {
      await employeeListPage.addButton.click();
      await addEmployeePage.expectLoaded();
      createdEmpNumber = await addEmployeePage.addEmployee(employee);
    });

    await test.step('Search the Employee List by name and verify the row', async () => {
      await topBar.openTab('Employee List');
      await employeeListPage.expectLoaded();
      await employeeListPage.searchByName(fullName(employee));

      const rows = employeeListPage.table.rows;
      await expect(rows).toHaveCount(1);
      await expect.poll(() => employeeListPage.table.readRow(rows.first())).toMatchObject({
        Id: employee.employeeId,
        'First (& Middle) Name': `${employee.firstName} ${employee.middleName}`,
        'Last Name': employee.lastName,
      });
    });

    await test.step('Log out', async () => {
      await topBar.logout();
      await expect(loginPage.loginButton).toBeVisible();
    });
  });
});
