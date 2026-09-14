# OrangeHRM QA Assignment

Automation for the QA assignment:

- **Part A** - UI tests for the OrangeHRM demo site (Playwright + TypeScript, Page Object Model)
- **Part B** - manual test cases and bug reports in `manual-tests/`
- **Part D** - API tests for JSONPlaceholder (Postman collection, run with Newman)

Sites: https://opensource-demo.orangehrmlive.com and https://jsonplaceholder.typicode.com/users

## Tech stack

Playwright, TypeScript, Page Object Model, Faker, Postman + Newman.

## Setup

Node.js 18 or newer.

```bash
npm install
npx playwright install chromium
```

## How to run

```bash
npm run test:all     # everything: UI tests first, then API tests
npm run test:ui      # all 4 UI tests
npm run test:api     # API tests only
npm run test:q1      # one UI test only (also test:q2, test:q3, test:q4)
```

## Reports

A report is created on every run, even if a test fails.

- UI: `reports/playwright-report/index.html` - open it with `npm run report:html`
- API: `reports/api-report.html` - open it in a browser

Reports from a passing run are also saved in `sample-reports/`.

## Test cases

| Test | File | What it does |
|------|------|--------------|
| Q1 | `tests/q1-invalid-login.spec.ts` | 3 wrong username/password combinations, checks the `Invalid credentials` error |
| Q2 | `tests/q2-pim-add-employee.spec.ts` | Adds an employee with random data, finds it in the employee list, logs out |
| Q3 | `tests/q3-admin-edit-user.spec.ts` | Changes a user role and status, refreshes and checks it was saved |
| Q4 | `tests/q4-leave-apply-cancel.spec.ts` | Applies for leave, checks Pending Approval, cancels it, checks Cancelled |

API collection: `api/JSONPlaceholder.postman_collection.json` - GET /users and PUT /users/{id}, 6 checks in total.

Manual tests: `manual-tests/OrangeHRM_Manual_Test_Cases.xlsx` - 11 test cases, a traceability sheet and 4 bug reports with screenshots.

## Config

Site URL and login details are in `src/config/env.ts`.
