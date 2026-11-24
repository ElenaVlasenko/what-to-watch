import { expect, type Page } from '@playwright/test';

export interface CatalogPage {
  open(): Promise<void>;
  expectLoaded(): Promise<void>;
  openFirstFilm(): Promise<string>;
  openSignIn(): Promise<void>;
}

export function createCatalogPage(page: Page): CatalogPage {
  const catalog = page.getByTestId('catalog');
  const genres = catalog.getByTestId('genre-list');
  const cards = catalog.getByRole('article');
  const allGenresItem = genres.getByRole('listitem').filter({
    has: page.getByRole('link', { name: 'All genres', exact: true }),
  });
  const signIn = page.locator('header').getByText('Sign in', { exact: true });

  async function expectLoaded(): Promise<void> {
    await expect(genres).toBeVisible();
    await expect(allGenresItem).toBeVisible();
    await expect(allGenresItem)
      .toHaveClass(/(?:^|\s)catalog__genres-item--active(?:\s|$)/);
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
