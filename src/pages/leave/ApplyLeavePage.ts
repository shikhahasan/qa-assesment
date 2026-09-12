import { expect } from '@playwright/test';
import { formatDate } from '../../utils/dates';
import { BasePage } from '../BasePage';

export interface LeaveApplication {
  leaveType: string;
  from: Date;
  to: Date;
  comment: string;
}

export class ApplyLeavePage extends BasePage {
  readonly title = this.page.locator('.orangehrm-main-title');
  readonly fromDate = this.field('From Date');
  readonly toDate = this.field('To Date');
  readonly comments = this.field('Comments');
  readonly applyButton = this.page.getByRole('button', { name: 'Apply' });
  readonly toast = this.page.locator('.oxd-toast');
  readonly overlapNotice = this.page.getByText('Overlapping Leave Request(s) Found');

  async expectLoaded() {
    await expect(this.page).toHaveURL(/leave\/applyLeave/);
    await expect(this.title).toHaveText('Apply Leave');
  }

  async apply(leave: LeaveApplication): Promise<{ saved: boolean; message: string }> {
    await this.selectOption('Leave Type', leave.leaveType);

    const pattern = await this.datePattern(this.fromDate);
    await this.fromDate.fill(formatDate(leave.from, pattern));
    await this.toDate.fill(formatDate(leave.to, pattern));
    await this.title.click(); // close the date picker
    await this.comments.fill(leave.comment);

    await this.applyButton.click();
    await expect(this.toast.or(this.overlapNotice).first()).toBeVisible();
    if (await this.overlapNotice.isVisible()) return { saved: false, message: 'Overlapping leave request found' };

    const message = (await this.toast.first().innerText()).replace(/\s+/g, ' ').trim();
    return { saved: /Successfully Saved/.test(message), message };
  }
}
