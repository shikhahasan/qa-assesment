import { env } from '../src/config/env';
import { expect, test } from '../src/fixtures/test';
import { newEmployee, newSystemUser } from '../src/utils/dataFactory';

test.describe('Q3 - Admin: search a user, edit role & status', { tag: '@q3' }, () => {
  let createdUserId: number | undefined;
  let createdEmpNumber: number | undefined;

  // Delete the user and employee this test created, so the shared demo stays clean.
  test.afterEach(async ({ api }) => {
    if (createdUserId) await api.deleteSystemUsers([createdUserId]);
    if (createdEmpNumber) await api.deleteEmployees([createdEmpNumber]);
    createdUserId = undefined;
    createdEmpNumber = undefined;
  });

  test('edited role and status persist after a page refresh', async ({
    page,
    api,
    loginPage,
    sidebar,
    systemUsersPage,
    editUserPage,
  }) => {
    // Our own throwaway user: editing a shared demo account (e.g. "Admin") would break other runs.
    const credentials = newSystemUser();
    const person = newEmployee();
    const employeeName = `${person.firstName} ${person.lastName}`;

    const user = await test.step('Precondition (API): create an ESS / Enabled user', async () => {
      const employee = await api.createEmployee({ firstName: person.firstName, lastName: person.lastName, employeeId: person.employeeId });
      createdEmpNumber = employee.empNumber;
      const created = await api.createSystemUser({ ...credentials, empNumber: employee.empNumber, role: 'ESS', enabled: true });
      createdUserId = created.id;
      return created;
    });

    await test.step('Log in as admin and open Admin → Users', async () => {
      await loginPage.loginAs(env.adminUsername, env.adminPassword);
      await sidebar.open('Admin');
      await systemUsersPage.expectLoaded();
    });

    await test.step(`Search by username "${credentials.username}" and verify the matching row`, async () => {
      await systemUsersPage.searchByUsername(credentials.username);
      const rows = systemUsersPage.table.rows;
      await expect(rows).toHaveCount(1);
      expect(await systemUsersPage.table.readRow(rows.first())).toMatchObject({
        Username: credentials.username,
        'User Role': 'ESS',
        'Employee Name': employeeName,
        Status: 'Enabled',
      });
    });

    await test.step('Edit the user: role ESS → Admin, status Enabled → Disabled, save', async () => {
      await systemUsersPage.openEdit(credentials.username);
      await editUserPage.expectLoaded();
      await editUserPage.setRole('Admin');
      await editUserPage.setStatus('Disabled');
      await editUserPage.save();
    });

    await test.step('Refresh the page, search again and verify the change persisted', async () => {
      await page.reload();
      await systemUsersPage.expectLoaded();
      await systemUsersPage.searchByUsername(credentials.username);
      const row = systemUsersPage.rowFor(credentials.username);
      await expect(row).toHaveCount(1);
      expect(await systemUsersPage.table.readRow(row)).toMatchObject({
        Username: credentials.username,
        'User Role': 'Admin',
        Status: 'Disabled',
      });
    });

    await test.step('Cross-check the saved values through the API', async () => {
      const saved = await api.getSystemUser(user.id);
      expect(saved.userRole.name).toBe('Admin');
      expect(saved.status).toBe(false);
    });
  });
});
