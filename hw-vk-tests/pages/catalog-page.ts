import { expect, type Page } from '@playwright/test';

export interface CatalogPage {
  open(): Promise<void>;
  expectLoaded(): Promise<void>;
  openFirstFilm(): Promise<string>;
  openSignIn(): Promise<void>;
}

export function createCatalogPage(page: Page): CatalogPage {
  const catalog = page.locator('section.catalog');
  const genres = catalog.locator('.catalog__genres-list');
  const cards = catalog.locator('article.small-film-card');
  const signIn = page.locator('header').getByText('Sign in', { exact: true });

  async function expectLoaded(): Promise<void> {
    await expect(genres).toBeVisible();
    await expect(genres.locator('.catalog__genres-item--active'))
      .toHaveText('All genres');
    await expect(cards.first()).toBeVisible();
  }

  async function open() {
    await page.goto('./');
    await expectLoaded();
  }

  async function openFirstFilm() {
    const title = cards.first().getByRole('heading', { level: 3 });
    await expect(title).toHaveText(/\S/);
    const name = (await title.innerText()).trim();
    await title.getByRole('link').click();
    return name;
  }

  async function openSignIn() {
      await signIn.click();
  }

  return {
    open,
    expectLoaded,
    openFirstFilm,
    openSignIn,
  };
}
