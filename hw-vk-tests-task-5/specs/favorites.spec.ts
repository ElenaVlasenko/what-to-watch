import { test, expect } from '../fixtures';
import { initialFavorite, promo } from '../data';

test.describe('Избранное', { tag: '@favorites' }, () => {
  test.use({ authenticated: true });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'My list 1', exact: true })).toBeVisible();
  });

  test('Добавление фильма обновляет счетчик и список, сохраняется после перезагрузки', async ({ page, api }) => {
    await page.getByRole('button', { name: 'My list 1', exact: true }).click();
    await expect(page.getByRole('button', { name: 'My list 2', exact: true })).toBeEnabled();
    expect(api.calls.some((call) => call.method === 'POST' && call.path === `/favorite/${promo.id}/1`)).toBe(true);
    await page.getByRole('img', { name: 'User avatar', exact: true }).click();
    await expect(page).toHaveURL(/#\/mylist$/);
    await expect(page.getByRole('heading', { name: 'My list 2', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3 })).toHaveText([initialFavorite.name, promo.name]);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'My list 2', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3 })).toHaveText([initialFavorite.name, promo.name]);
  });

  test('Удаление последнего фильма обновляет счетчик и оставляет пустой список', async ({ page, api }) => {
    await page.goto(`/#/films/${initialFavorite.id}`);
    await expect(page.getByRole('heading', { name: initialFavorite.name, exact: true, level: 2 })).toBeVisible();
    await page.getByRole('button', { name: 'My list 1', exact: true }).click();
    await expect(page.getByRole('button', { name: 'My list 0', exact: true })).toBeEnabled();
    expect(api.calls.some((call) => call.method === 'POST' && call.path === `/favorite/${initialFavorite.id}/0`)).toBe(true);
    await page.getByRole('img', { name: 'User avatar', exact: true }).click();
    await expect(page).toHaveURL(/#\/mylist$/);
    await expect(page.getByRole('heading', { name: 'My list 0', exact: true })).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(0);
  });
});
