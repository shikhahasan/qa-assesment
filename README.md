# OrangeHRM UI Automation — Playwright + TypeScript (POM)

End-to-end UI automation for the OrangeHRM open-source demo, covering Part A (Q1–Q4) of the assignment.

- **Application under test:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- **Stack:** Playwright Test · TypeScript · Page Object Model · Faker

## Scenarios

| # | Tag | Spec | What it does |
|---|-----|------|--------------|
| Q1 | `@q1` | `tests/q1-invalid-login.spec.ts` | Three invalid username/password combinations; checks the `Invalid credentials` error and that the user stays on the login page |
| Q2 | `@q2` | `tests/q2-pim-add-employee.spec.ts` | Log in → PIM → add an employee with random data → search the Employee List → check the row → log out |
| Q3 | `@q3` | `tests/q3-admin-edit-user.spec.ts` | Log in → Admin → search a user → change role (ESS → Admin) and status (Enabled → Disabled) → save → refresh → check it persisted |
| Q4 | `@q4` | `tests/q4-leave-apply-cancel.spec.ts` | Log in → Leave → apply for leave → check it shows as `Pending Approval` in My Leave → cancel it → check the status becomes `Cancelled` |

Each scenario logs in on its own and creates its own data, so they can run one at a time or all together.

## Setup

```bash
npm install
npx playwright install chromium
```

Node.js 18 or newer is needed.

## Running the tests

```bash
npm test             # all four scenarios, in order
npm run test:q1      # one scenario only (same for q2, q3, q4)
npm run test:headed  # watch it run in a browser
npm run typecheck    # TypeScript check, no tests
```

## Report

An HTML report is written to `reports/playwright-report/` on **every** run, whether the tests pass or fail:

```bash
npm run report:html
```

When a test fails, its screenshot, video and trace are attached to the report.

## Configuration

The URL, the admin login and the leave type used by Q4 are all in one file —
`src/config/env.ts`. Change them there and every test picks them up.

## Project structure

```
src/
  api/OrangeHrmApi.ts   REST client, used only to create and delete test data
  components/           Sidebar, TopBar, DataTable — shared parts of every screen
  config/env.ts         URL and login details
  fixtures/test.ts      Page objects injected into the tests
  pages/                Page objects (BasePage + PIM / Admin / Leave pages)
  utils/                Random test data (Faker), date and text helpers
tests/                  One spec per question (q1 … q4)
```

