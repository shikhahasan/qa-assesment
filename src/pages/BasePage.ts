import { expect, type Locator, type Page, type Response } from '@playwright/test';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { formatDate } from '../utils/dates';
import { exactText } from '../utils/text';

export abstract class BasePage {
  readonly sidebar: Sidebar;
  readonly topBar: TopBar;

  constructor(protected readonly page: Page) {
    this.sidebar = new Sidebar(page);
    this.topBar = new TopBar(page);
  }

  /** An OrangeHRM form group (label + control), located by its visible label. */
  protected group(label: string): Locator {
    return this.page.locator('.oxd-input-group').filter({
      has: this.page.locator('label', { hasText: exactText(label) }),
    });
  }

  protected field(label: string): Locator {
    return this.group(label).locator('input, textarea').first();
  }

  protected async selectOption(label: string, option: string) {
    await this.group(label).locator('.oxd-select-text').click();
    await this.page.locator('.oxd-select-dropdown .oxd-select-option', { hasText: exactText(option) }).click();
    await expect(this.group(label).locator('.oxd-select-text-input')).toHaveText(option);
  }

  protected async clickAndWaitForApi(trigger: Locator, apiPath: string): Promise<Response> {
    const [response] = await Promise.all([
      this.page.waitForResponse((r) => r.url().includes(apiPath) && r.request().method() === 'GET'),
      trigger.click(),
    ]);
    await this.waitForLoaders();
    return response;
  }

  async waitForLoaders() {
    await expect(this.page.locator('.oxd-loading-spinner, .oxd-form-loader')).toHaveCount(0);
  }

  async expectToast(message: string | RegExp) {
    await expect(this.page.locator('.oxd-toast-content-text', { hasText: message }).first()).toBeVisible();
  }

  protected async fillDateRange(fromInput: Locator, toInput: Locator, from: Date, to: Date, blurTarget: Locator) {
    const pattern = (await fromInput.getAttribute('placeholder')) || 'yyyy-mm-dd';
    const fromText = formatDate(from, pattern);
    const toText = formatDate(to, pattern);

    await fromInput.fill(fromText);
    await blurTarget.click();
    await expect(async () => {
      await toInput.fill(toText);
      await blurTarget.click();
      await expect(toInput).toHaveValue(toText, { timeout: 1_000 });
    }).toPass({ timeout: 10_000 });
    await expect(fromInput).toHaveValue(fromText);
  }
}
