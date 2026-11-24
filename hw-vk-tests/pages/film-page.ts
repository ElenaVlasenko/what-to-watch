import { expect, type Page } from '@playwright/test';

export interface FilmPage {
  expectOpened(name: string): Promise<void>;
  openDetails(): Promise<void>;
  expectDetails(): Promise<void>;
}

export function createFilmPage(page: Page): FilmPage {
  const film = page.getByTestId('film-page');
  const navigation = film.getByRole('navigation');
  const detailsLink = navigation.getByRole('link', { name: 'Details', exact: true });
  const detailsItem = navigation.getByRole('listitem').filter({
    has: page.getByRole('link', { name: 'Details', exact: true }),
  });

  async function expectOpened(name: string) {
    await expect(page).toHaveURL(/#\/films\/[^/?#]+(?:\?.*)?$/);
    await expect(film.getByRole('heading', { name, exact: true })).toBeVisible();
    await expect(film.getByRole('button', { name: 'Play', exact: true }))
      .toBeVisible();
  }

  async function openDetails() {
    await detailsLink.click();
  }

  async function expectDetails() {
    await expect(detailsItem).toBeVisible();
    await expect(detailsItem)
      .toHaveClass(/(?:^|\s)film-nav__item--active(?:\s|$)/);
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
    expectDetails,
  };
}
