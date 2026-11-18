import type { Page } from '@playwright/test';

// Loadable Component: каждая страница умеет открываться и дожидаться готовности.
export abstract class LoadableComponent {
  constructor(protected readonly page: Page) {}

  abstract open(): Promise<this>;
  abstract waitForLoaded(): Promise<this>;

  protected async load(path: string): Promise<this> {
    await this.page.goto(path);
    return this.waitForLoaded();
  }
}
