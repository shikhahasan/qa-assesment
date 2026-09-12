import { env } from '../src/config/env';
import { expect, test } from '../src/fixtures/test';
import { invalidPassword, invalidUsername } from '../src/utils/dataFactory';

const EXPECTED_ERROR = 'Invalid credentials';

const invalidCombinations = [
  { name: 'valid username + wrong password', username: env.adminUsername, password: invalidPassword() },
  { name: 'unknown username + valid password', username: invalidUsername(), password: env.adminPassword },
  { name: 'unknown username + wrong password', username: invalidUsername(), password: invalidPassword() },
];

test.describe('Q1 - Login with invalid credentials', { tag: '@q1' }, () => {
  for (const combo of invalidCombinations) {
    test(`shows "${EXPECTED_ERROR}" for ${combo.name}`, async ({ page, loginPage }) => {
      await test.step('Open the login page', () => loginPage.goto());

      await test.step(`Log in as "${combo.username}" with an invalid combination`, () =>
        loginPage.login(combo.username, combo.password),
      );

      await test.step(`Verify the "${EXPECTED_ERROR}" error and that the user stays on login`, async () => {
        await loginPage.expectError(EXPECTED_ERROR);
        await expect(page).toHaveURL(/auth\/login/);
        await expect(loginPage.loginButton).toBeVisible();
      });
    });
  }
});
