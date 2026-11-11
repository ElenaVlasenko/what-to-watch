import { test, expect } from '../fixtures';
import { comments, films, promo } from '../data';

test.describe('Карточка фильма', { tag: '@film' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/#/films/${promo.id}`);
    await expect(page.getByRole('heading', { name: promo.name, level: 2, exact: true })).toBeVisible();
  });

  test('OverView показывает описание, рейтинг и режиссера', { tag: '@smoke' }, async ({ page }) => {
    await expect.soft(page.locator('.film-nav__item--active')).toHaveText('OverView');
    await expect.soft(page.getByText(promo.description, { exact: true })).toBeVisible();
    await expect.soft(page.locator('.film-rating__score')).toHaveText('8.5');
    await expect.soft(page.locator('.film-rating__count')).toHaveText('120 ratings');
    await expect.soft(page.getByText(`Director: ${promo.director}`, { exact: true })).toBeVisible();
  });

  test('Details показывает все сведения и скрывает обзор', async ({ page }) => {
    await page.getByRole('link', { name: 'Details', exact: true }).click();
    await expect(page.locator('.film-nav__item--active')).toHaveText('Details');
    const expectedDetails = [
      ['Director', promo.director], ['Starring', 'Alice Actor, Bob Actor'],
      ['Run Time', '01:30:00'], ['Genre', promo.genre], ['Released', String(promo.released)],
    ];
    for (const [label, value] of expectedDetails) {
      const row = page.locator('.film-card__details-item').filter({ has: page.getByText(label, { exact: true }) });
      await expect.soft(row.locator('.film-card__details-value'), label).toHaveText(value);
    }
    await expect(page.locator('.film-rating')).toHaveCount(0);
  });

  test('Comments показывает текст, автора и оценку отзыва', async ({ page }) => {
    await page.getByRole('link', { name: 'Comments', exact: true }).click();
    await expect(page.locator('.film-nav__item--active')).toHaveText('Comments');
    await expect(page.locator('.review')).toHaveCount(1);
    await expect.soft(page.getByText(comments[0].comment, { exact: true })).toBeVisible();
    await expect.soft(page.getByText(comments[0].user, { exact: true })).toBeVisible();
    await expect.soft(page.locator('.review__rating')).toHaveText('9');
  });

  test.describe('Прямые ссылки на вкладки', () => {
    for (const tab of ['Details', 'Comments']) {
      test(`Параметр tab=${tab} открывает нужную вкладку после перезагрузки`, async ({ page }) => {
        await page.goto(`/#/films/${promo.id}?tab=${tab}`);
        await page.reload();
        await expect(page.locator('.film-nav__item--active')).toHaveText(tab);
        await expect(tab === 'Details'
          ? page.getByText(promo.director, { exact: true })
          : page.getByText(comments[0].comment, { exact: true })).toBeVisible();
      });
    }
  });

  test('More like this ограничивает список четырьмя фильмами и открывает выбранный', async ({ page }) => {
    // У section нет aria-labelledby, поэтому область находим по заголовку.
    const catalog = page.locator('section').filter({ has: page.getByRole('heading', { name: 'More like this', exact: true }) });
    await expect(catalog.getByRole('heading', { level: 3 })).toHaveText(films.slice(1, 5).map((film) => film.name));
    await catalog.getByRole('link', { name: films[1].name, exact: true }).click();
    await expect(page).toHaveURL(/#\/films\/2$/);
    await expect(page.getByRole('heading', { name: films[1].name, exact: true, level: 2 })).toBeVisible();
  });

  test('Play открывает плеер, Exit возвращает каталог', { tag: '@player' }, async ({ page }) => {
    // Аналог @Disabled: явный условный пропуск для окружений без проверки плеера.
    test.skip(process.env.HW5_SKIP_PLAYER === '1', 'Проверка плеера отключена через HW5_SKIP_PLAYER=1');
    test.setTimeout(45_000);
    await page.getByRole('button', { name: 'Play', exact: true }).click();
    await expect(page).toHaveURL(/#\/player\/1$/);
    await expect(page.locator('.player__name')).toHaveText(promo.name);
    await expect(page.locator('video source')).toHaveAttribute('src', promo.videoLink);
    await page.getByRole('button', { name: 'Exit', exact: true }).click();
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.getByRole('article')).toHaveCount(8);
  });
});
