import { expect, type Locator } from '@playwright/test';
import { DataTable } from '../../components/DataTable';
import { formatDate } from '../../utils/dates';
import { exactText } from '../../utils/text';
import { BasePage } from '../BasePage';

export type LeaveStatus = 'Rejected' | 'Cancelled' | 'Pending Approval' | 'Scheduled' | 'Taken';

export class MyLeavePage extends BasePage {
  readonly table = new DataTable(this.page);
  readonly title = this.page.locator('.oxd-table-filter-title');
  readonly fromDate = this.field('From Date');
  readonly toDate = this.field('To Date');
  readonly statusFilter = this.group('Show Leave with Status');
  readonly searchButton = this.page.getByRole('button', { name: 'Search' });

  async expectLoaded() {
    await expect(this.page).toHaveURL(/leave\/viewMyLeaveList/);
    await expect(this.title).toHaveText('My Leave List');
    await this.waitForLoaders();
  }

  async filter(opts: { from: Date; to: Date; statuses: LeaveStatus[] }) {
    const pattern = await this.datePattern(this.fromDate);
    await this.fromDate.fill(formatDate(opts.from, pattern));
    await this.toDate.fill(formatDate(opts.to, pattern));
    await this.title.click(); // close the date picker
    await this.setStatuses(opts.statuses);
    await this.clickAndWaitForApi(this.searchButton, '/api/v2/leave/leave-requests');
  }

  private async setStatuses(statuses: LeaveStatus[]) {
    const chips = this.statusFilter.locator('.oxd-chip');
    while ((await chips.count()) > 0) await chips.first().locator('i').click();

    for (const status of statuses) {
      await this.statusFilter.locator('.oxd-select-text').click();
      await this.page.locator('.oxd-select-dropdown .oxd-select-option', { hasText: exactText(status) }).click();
    }
    await expect(chips).toHaveCount(statuses.length);
    await this.title.click(); // close the dropdown if still open
  }

  rowWithComment(comment: string): Locator {
    return this.table.rowContaining(comment);
  }

  async statusCell(row: Locator): Promise<Locator> {
    return this.table.cell(row, 'Status');
  }

  async cancel(row: Locator) {
    await row.getByRole('button', { name: 'Cancel' }).click();
    await this.expectToast('Successfully Updated');
    await this.waitForLoaders();
  }
}
