# OrangeHRM QA Assignment

Automation tests for the QA assignment.

- UI tests (Part A): OrangeHRM demo site, written with Playwright
- Manual tests (Part B): test cases and bug reports in an Excel file
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

Run everything together (UI first, then API):

```bash
npm run test:all
```

Run one part or one test only:

```bash
npm run test:ui      # all 4 UI tests
npm run test:api     # only the API tests
npm run test:q1      # only Q1 (also test:q2, test:q3, test:q4)
npm run test:headed  # run UI tests in a visible browser
```

## Reports

A report is created every time you run the tests, even if a test fails.

- UI report: `reports/playwright-report/index.html` (open it with `npm run report:html`)
- API report: `reports/api-report.html` (open it in a browser)

If a UI test fails, the report also has a screenshot, a video and a trace file.

Reports from a passing run are also saved in the repo, inside the `sample-reports/` folder, so you can
see them without running the tests.

## Part A - UI test cases

| Test | File | What it does |
|------|------|--------------|
| Q1 | `tests/q1-invalid-login.spec.ts` | Tries 3 wrong username/password combinations and checks the error message `Invalid credentials` |
| Q2 | `tests/q2-pim-add-employee.spec.ts` | Logs in, adds a new employee with random data, searches for it in the employee list, then logs out |
| Q3 | `tests/q3-admin-edit-user.spec.ts` | Searches a user in Admin, changes the role and status, saves, refreshes the page and checks the change is still there |
| Q4 | `tests/q4-leave-apply-cancel.spec.ts` | Applies for leave, checks it shows as Pending Approval, cancels it and checks the status becomes Cancelled |

Every test logs in by itself and makes its own data. So you can run one test alone or all of them together.

## Part B - Manual test cases

Folder: `manual-tests/`

- `OrangeHRM_Manual_Test_Cases.xlsx` - 11 test cases for Login, PIM, Admin and Leave
- `screenshots/` - the screenshots used in the bug reports

The Excel file has these sheets:

- **Login, PIM, Admin, Leave** - the test cases, with Test ID, Title, Preconditions, Steps, Expected Result, Actual Result, Status and Priority
- **Traceability** - which module and feature every test checks, and which tests are already automated in Part A
- **Bug Reports** - 4 bugs found while testing, with steps, expected vs actual, severity and a screenshot

These manual cases check things the automation does not check, for example empty fields, unauthorized
access after logout, very long input, numbers in name fields and SQL injection strings.

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
api/             Postman collection
manual-tests/    manual test cases and bug report screenshots
sample-reports/  reports from a passing run
scripts/         run-api.mjs (Newman) and run-all.mjs (UI + API)
src/
  api/           small API client, only used to create and delete test data
  components/    Sidebar, TopBar and DataTable (parts that are on every page)
  config/        site URL and login details
  fixtures/      page objects given to the tests
  pages/         page objects
  utils/         random data, date and text helpers
tests/           the 4 test files
```
