import { expect, type Page } from '@playwright/test';

export interface FilmPage {
  expectOpened(name: string): Promise<void>;
  openDetails(): Promise<void>;
  expectDetails(): Promise<void>;
}

export function createFilmPage(page: Page): FilmPage {
  const film = page.locator('section.film-card--full');
  const navigation = film.getByRole('navigation');

  async function expectOpened(name: string) {
    await expect(page).toHaveURL(/#\/films\/[^/?#]+(?:\?.*)?$/);
    await expect(film.getByRole('heading', { name, exact: true })).toBeVisible();
    await expect(film.getByRole('button', { name: 'Play', exact: true }))
      .toBeVisible();
  }

  async function openDetails() {
    await navigation.getByRole('link', { name: 'Details', exact: true }).click();
  }

  async function expectDetails() {
    await expect(navigation.locator('.film-nav__item--active'))
      .toHaveText('Details');
    for (const label of ['Director', 'Genre', 'Released']) {
      const detail = film.locator('.film-card__details-item').filter({
        has: page.getByText(label, { exact: true }),
      });
      await expect(detail).toBeVisible();
      await expect(detail.locator('.film-card__details-value')).toHaveText(/\S/);
    }
  }

  return {
    expectOpened,
    openDetails,
    expectDetails
  };
}
