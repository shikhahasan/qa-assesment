import { expect, type Locator, type Page, type Response } from '@playwright/test';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { exactText } from '../utils/text';

export abstract class BasePage {
  readonly sidebar: Sidebar;
  readonly topBar: TopBar;

  constructor(protected readonly page: Page) {
    this.sidebar = new Sidebar(page);
    this.topBar = new TopBar(page);
  }

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

  protected async datePattern(input: Locator): Promise<string> {
    return (await input.getAttribute('placeholder')) || 'yyyy-mm-dd';
  }
}
