# OrangeHRM QA Assignment

Automation tests for the QA assignment.

- UI tests (Part A): OrangeHRM demo site, written with Playwright
- API tests (Part D): JSONPlaceholder users API, written in Postman and run with Newman

Sites used:

- UI: https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
- API: https://jsonplaceholder.typicode.com/users

## Tech stack

- Playwright with TypeScript
- Page Object Model
- Faker for random test data
- Postman collection + Newman for the API tests

## Setup

You need Node.js 18 or newer.

```bash
npm install
npx playwright install chromium
```

## How to run

```bash
npm test             # run all 4 UI tests
npm run test:q1      # run only Q1 (also test:q2, test:q3, test:q4)
npm run test:api     # run the Postman collection
npm run test:headed  # run UI tests in a visible browser
```

## Reports

A report is created every time you run the tests, even if a test fails.

- UI report: `reports/playwright-report/index.html` (open it with `npm run report:html`)
- API report: `reports/api-report.html` (open it in a browser)

If a UI test fails, the report also has a screenshot, a video and a trace file.

## Part A - UI test cases

| Test | File | What it does |
|------|------|--------------|
| Q1 | `tests/q1-invalid-login.spec.ts` | Tries 3 wrong username/password combinations and checks the error message `Invalid credentials` |
| Q2 | `tests/q2-pim-add-employee.spec.ts` | Logs in, adds a new employee with random data, searches for it in the employee list, then logs out |
| Q3 | `tests/q3-admin-edit-user.spec.ts` | Searches a user in Admin, changes the role and status, saves, refreshes the page and checks the change is still there |
| Q4 | `tests/q4-leave-apply-cancel.spec.ts` | Applies for leave, checks it shows as Pending Approval, cancels it and checks the status becomes Cancelled |

Every test logs in by itself and makes its own data. So you can run one test alone or all of them together.

## Part D - API test cases

File: `api/JSONPlaceholder.postman_collection.json`

It has 2 requests and 6 checks:

**GET /users**
- status code is 200
- the response is a list and it is not empty
- every user has id, name and email
- saves the first user id in a collection variable

**PUT /users/{{userId}}**
- status code is 200
- the id in the response is the same id we saved
- the phone field is not empty
- name, email and company name are new values on every run

## Folders

```
api/         Postman collection
scripts/     script that runs Newman and saves the report
src/
  api/       small API client, only used to create and delete test data
  components/  Sidebar, TopBar and DataTable (parts that are on every page)
  config/    site URL and login details
  fixtures/  page objects given to the tests
  pages/     page objects
  utils/     random data, date and text helpers
tests/       the 4 test files
```

## Why some things are done this way

- Page Object Model: the locators are in the page files, the test files only have the steps and the checks.
- `DataTable` finds a cell by the column name, not by the column number. So if the site adds a new column, the tests still work.
- The demo site is public and everyone uses it. So Q3 creates its own user instead of editing the Admin user, and Q4 adds its own leave balance and picks a random date. Everything it creates is deleted after the test.
- `workers: 1` in the config, because running tests together on the same site makes them change each other's data.
- No `waitForTimeout`. The tests wait for the real API response instead.
- The date format is read from the input placeholder, because this site uses `yyyy-dd-mm`.
- In the PUT request I send the full user object and change only name, email and company name. This API sends back whatever you send it, so if I send only 3 fields there is no phone field in the response and the phone check cannot work.

## If something fails

- Tests time out: the demo site is slow sometimes, run them again.
- `Leave could not be applied on 3 different date ranges`: someone else already took leave on those dates, run it again.
- `Invalid credentials` in all tests: the demo site password changed, update `src/config/env.ts`.
- `newman: command not found`: run `npm install` first.
