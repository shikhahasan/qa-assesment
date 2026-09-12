import type { Locator, Page } from '@playwright/test';
export class DataTable {
  readonly root: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.root = page.locator('.oxd-table');
    this.rows = this.root.locator('.oxd-table-body .oxd-table-card');
  }

  async headers(): Promise<string[]> {
    return (await this.root.locator('.oxd-table-header .oxd-table-header-cell').allInnerTexts()).map((h) => h.trim());
  }

  async columnIndex(header: string): Promise<number> {
    const headers = await this.headers();
    const index = headers.indexOf(header);
    if (index === -1) throw new Error(`Column "${header}" not found. Columns: ${headers.join(' | ')}`);
    return index;
  }

  rowContaining(text: string | RegExp): Locator {
    return this.rows.filter({ hasText: text });
  }

  async cell(row: Locator, header: string): Promise<Locator> {
    return row.locator('.oxd-table-cell').nth(await this.columnIndex(header));
  }

  async readRow(row: Locator): Promise<Record<string, string>> {
    const [headers, cells] = await Promise.all([this.headers(), row.locator('.oxd-table-cell').allInnerTexts()]);
    return Object.fromEntries(headers.map((h, i) => [h, (cells[i] ?? '').replace(/\s+/g, ' ').trim()]));
  }
}
