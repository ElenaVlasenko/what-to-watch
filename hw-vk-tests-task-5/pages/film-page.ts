import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LoadableComponent } from '../components/loadable-component';
import { PageElement } from '../components/page-element';
import type { Film } from '../value-objects/film';

export class FilmPage extends LoadableComponent {
  private readonly title: PageElement;

  constructor(page: Page, private readonly film: Film) {
    super(page);
    this.title = new PageElement(page.getByRole('heading', { name: film.name, exact: true, level: 2 }));
  }

  open(): Promise<this> {
    return this.load(`/#${this.film.path}`);
  }

  async waitForLoaded(): Promise<this> {
    await expect(this.page).toHaveURL(new RegExp(`#${this.film.path}$`));
    await this.title.shouldBeVisible();
    return this;
  }

  async shouldHaveDescription(description: string): Promise<this> {
    await new PageElement(this.page.getByText(description, { exact: true })).shouldBeVisible();
    return this;
  }
}
