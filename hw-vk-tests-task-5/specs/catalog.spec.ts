import { test, expect } from '../fixtures';
import { films, promo } from '../data';

test.describe('Каталог', { tag: '@catalog' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Catalog', exact: true })).toBeAttached();
    await expect(page.getByRole('article')).toHaveCount(8);
  });

  test('Первые восемь фильмов, промофильм и жанр по умолчанию', { tag: '@smoke' }, async ({ page }) => {
    await expect.soft(page.getByRole('heading', { level: 3 })).toHaveText(films.slice(0, 8).map((film) => film.name));
    await expect.soft(page.getByRole('heading', { name: promo.name, exact: true, level: 2 })).toBeVisible();
    await expect.soft(page.locator('.catalog__genres-item--active')).toHaveText('All genres');
    await expect.soft(page.getByRole('button', { name: 'Show more' })).toBeVisible();
  });

  test('Show more показывает оставшиеся фильмы и исчезает', async ({ page }) => {
    await page.getByRole('button', { name: 'Show more' }).click();
    await expect(page.getByRole('heading', { level: 3 })).toHaveText(films.map((film) => film.name));
    await expect(page.getByRole('button', { name: 'Show more' })).toHaveCount(0);
  });

  test.describe('Фильтрация по жанрам', () => {
    // Аналог @ParameterizedTest / @TestFactory: отдельный тест для каждого жанра.
    for (const genre of ['Action', 'Comedy', 'Drama']) {
      test(`Жанр ${genre} показывает только соответствующие фильмы`, async ({ page }) => {
        await page.getByRole('link', { name: genre, exact: true }).click();
        await expect(page.getByRole('heading', { level: 3 })).toHaveText(
          films.filter((film) => film.genre === genre).map((film) => film.name),
        );
        await expect(page.locator('.catalog__genres-item--active')).toHaveText(genre);
        await expect(page.getByRole('button', { name: 'Show more' })).toHaveCount(0);
      });
    }
  });

  test('All genres возвращает общий каталог после фильтрации', async ({ page }) => {
    await page.getByRole('link', { name: 'Comedy', exact: true }).click();
    await expect(page.getByRole('article')).toHaveCount(4);
    await page.getByRole('link', { name: 'All genres', exact: true }).click();
    await expect(page.getByRole('heading', { level: 3 })).toHaveText(films.slice(0, 8).map((film) => film.name));
    await expect(page.locator('.catalog__genres-item--active')).toHaveText('All genres');
  });

  test('Смена жанра сбрасывает увеличенный размер каталога', async ({ page }) => {
    await page.getByRole('button', { name: 'Show more' }).click();
    await expect(page.getByRole('article')).toHaveCount(12);
    await page.getByRole('link', { name: 'Drama', exact: true }).click();
    await expect(page.getByRole('article')).toHaveCount(4);
    await page.getByRole('link', { name: 'All genres', exact: true }).click();
    await expect(page.getByRole('article')).toHaveCount(8);
    await expect(page.getByRole('button', { name: 'Show more' })).toBeVisible();
  });

  test('Карточка открывает именно выбранный фильм', { tag: '@smoke' }, async ({ page }) => {
    await page.getByRole('heading', { name: films[2].name, exact: true, level: 3 }).getByRole('link').click();
    await expect(page).toHaveURL(/#\/films\/3$/);
    await expect(page.getByRole('heading', { name: films[2].name, exact: true, level: 2 })).toBeVisible();
  });
});
