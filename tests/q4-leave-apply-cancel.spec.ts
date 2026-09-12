import { env } from '../src/config/env';
import { expect, test } from '../src/fixtures/test';
import { uniqueTag } from '../src/utils/dataFactory';
import { addDays, parseIsoDate, randomWeekday, toIsoDate } from '../src/utils/dates';

const MAX_ATTEMPTS = 3;

test.describe('Q4 - Leave: apply, verify Pending Approval, cancel', { tag: '@q4' }, () => {
  let entitlementId: number | undefined;

  test.afterEach(async ({ api }) => {
    if (entitlementId) await api.deleteLeaveEntitlements([entitlementId]);
    entitlementId = undefined;
  });

  test('applied leave shows as Pending Approval in My Leave and becomes Cancelled', async ({
    page,
    api,
    loginPage,
    sidebar,
    topBar,
    applyLeavePage,
    myLeavePage,
  }) => {
    const comment = uniqueTag('QA-leave');

    const { leaveType, period } = await test.step('Precondition (API): make sure the admin has leave balance', async () => {
      const period = await api.currentLeavePeriod();
      const leaveType = await api.leaveType(env.leaveType);
      const { balance, empNumber } = await api.myLeaveBalance(leaveType.id);
      const days = Math.max(0, Math.ceil(-balance)) + 5;
      const entitlement = await api.addLeaveEntitlement({ empNumber, leaveTypeId: leaveType.id, period, days });
      entitlementId = entitlement.id;
      return { leaveType, period };
    });

    await test.step('Log in and open Leave → Apply', async () => {
      await loginPage.loginAs(env.adminUsername, env.adminPassword);
      await sidebar.open('Leave');
      await topBar.openTab('Apply');
      await applyLeavePage.expectLoaded();
    });

    const earliest = addDays(new Date(), 7);
    const periodEnd = parseIsoDate(period.endDate);
    const latest = new Date(Math.min(periodEnd.getTime(), addDays(new Date(), 120).getTime()));

    const { from, to } = await test.step(`Apply for "${leaveType.name}" leave`, async () => {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const from = randomWeekday(earliest, addDays(latest, -1), [1, 2, 3, 4]);
        const to = addDays(from, 1);
        const result = await applyLeavePage.apply({ leaveType: leaveType.name, from, to, comment });
        if (result.saved) return { from, to };
        test.info().annotations.push({ type: 'date-retry', description: `${toIsoDate(from)}: ${result.message}` });
        await page.goto('leave/applyLeave');
        await applyLeavePage.expectLoaded();
      }
      throw new Error(`Leave could not be applied on ${MAX_ATTEMPTS} different date ranges`);
    });

    const row = myLeavePage.rowWithComment(comment);

    await test.step('Verify the request is listed in My Leave with status "Pending Approval"', async () => {
      await topBar.openTab('My Leave');
      await myLeavePage.expectLoaded();
      await myLeavePage.filter({ from, to, statuses: ['Pending Approval'] });
      await expect(row).toHaveCount(1);
      await expect(await myLeavePage.statusCell(row)).toContainText('Pending Approval');
    });

    await test.step('Cancel the request', async () => {
      await myLeavePage.cancel(row);
      await expect(row).toHaveCount(0);
    });

    await test.step('Refresh, filter by "Cancelled" and verify the status updated', async () => {
      await page.reload();
      await myLeavePage.expectLoaded();
      await myLeavePage.filter({ from, to, statuses: ['Cancelled'] });
      await expect(row).toHaveCount(1);
      await expect(await myLeavePage.statusCell(row)).toContainText('Cancelled');
    });
  });
});
