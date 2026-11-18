import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LoadableComponent } from '../components/loadable-component';
import { PageElement } from '../components/page-element';
import type { Film } from '../value-objects/film';
import { FilmPage } from './film-page';

export class MainPage extends LoadableComponent {
  private readonly catalogHeading: PageElement;
  private readonly showMoreButton: PageElement;
  private readonly avatar: PageElement;
  private readonly signOutLink: PageElement;

  constructor(page: Page) {
    super(page);
    this.catalogHeading = new PageElement(page.getByRole('heading', { name: 'Catalog', exact: true }));
    this.showMoreButton = new PageElement(page.getByRole('button', { name: 'Show more', exact: true }));
    this.avatar = new PageElement(page.getByRole('img', { name: 'User avatar', exact: true }));
    this.signOutLink = new PageElement(page.locator('header').getByText('Sign out', { exact: true }));
  }

  open(): Promise<this> {
    return this.load('/');
  }

  async waitForLoaded(): Promise<this> {
    await this.catalogHeading.shouldBeAttached();
    await expect(this.page.getByRole('article')).toHaveCount(8);
    return this;
  }

  async shouldBeAuthenticated(): Promise<this> {
    await this.avatar.shouldBeVisible();
    await this.signOutLink.shouldBeVisible();
    return this;
  }

  async shouldDisplayFilms(films: readonly Film[]): Promise<this> {
    await expect(this.page.getByRole('heading', { level: 3 })).toHaveText(
      films.map((film) => film.name),
    );
    return this;
  }

  async showAllFilms(): Promise<this> {
    await this.showMoreButton.click();
    await this.showMoreButton.shouldHaveCount(0);
    return this;
  }

  async openFilm(film: Film): Promise<FilmPage> {
    const filmLink = new PageElement(
      this.page.getByRole('heading', { name: film.name, exact: true, level: 3 }).getByRole('link'),
    );
    await filmLink.click();
    return new FilmPage(this.page, film).waitForLoaded();
  }
}
