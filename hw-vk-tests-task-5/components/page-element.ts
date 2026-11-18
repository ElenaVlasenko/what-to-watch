import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';

// Wrapper: инкапсулирует Locator и предоставляет цепочку действий и проверок.
export class PageElement {
  constructor(private readonly locator: Locator) {}

  async click(): Promise<this> {
    await this.locator.click();
    return this;
  }

  async fill(value: string): Promise<this> {
    await this.locator.fill(value);
    return this;
  }

  async shouldBeAttached(): Promise<this> {
    await expect(this.locator).toBeAttached();
    return this;
  }

  async shouldBeVisible(): Promise<this> {
    await expect(this.locator).toBeVisible();
    return this;
  }

  async shouldHaveCount(count: number): Promise<this> {
    await expect(this.locator).toHaveCount(count);
    return this;
  }

  async shouldHaveText(text: string): Promise<this> {
    await expect(this.locator).toHaveText(text);
    return this;
  }
}
