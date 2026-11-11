import { test, expect } from '../fixtures';
import { user } from '../data';

test.describe('Авторизация', { tag: '@auth' }, () => {
  test.describe('Гость', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('article')).toHaveCount(8);
    });

    test('Sign in открывает форму с полями и скрытым паролем', { tag: '@smoke' }, async ({ page }) => {
      await page.locator('header').getByText('Sign in', { exact: true }).click();
      await expect(page).toHaveURL(/#\/login$/);
      await expect.soft(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
      await expect.soft(page.getByLabel('Email address', { exact: true })).toBeVisible();
      await expect.soft(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'password');
      await expect.soft(page.getByRole('button', { name: 'Sign in', exact: true })).toBeEnabled();
    });

    test.describe('Валидация пароля', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/#/login');
        await expect(page.getByLabel('Email address', { exact: true })).toBeVisible();
      });

      const invalidPasswords = [
        { name: 'без цифр', value: 'letters' },
        { name: 'без букв', value: '123456' },
        { name: 'пустой', value: '' },
      ];
      for (const password of invalidPasswords) {
        test(`Пароль ${password.name} отклоняется без запроса входа`, async ({ page, api }) => {
          await page.getByLabel('Email address', { exact: true }).fill(user.email);
          await page.getByLabel('Password', { exact: true }).fill(password.value);
          await page.getByRole('button', { name: 'Sign in', exact: true }).click();
          await expect(page.locator('.sign-in__message')).toHaveText(
            'Password must includes at least one digit and one letter.',
          );
          await expect(page).toHaveURL(/#\/login$/);
          expect(api.calls.filter((call) => call.method === 'POST' && call.path === '/login')).toEqual([]);
        });
      }
    });

    test('Валидные данные выполняют вход и сохраняют токен', { tag: '@smoke' }, async ({ page, api }) => {
      await page.goto('/#/login');
      await page.getByLabel('Email address', { exact: true }).fill(user.email);
      await page.getByLabel('Password', { exact: true }).fill('Student123');
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
      await expect(page).toHaveURL(/#\/$/);
      await expect(page.getByRole('img', { name: 'User avatar', exact: true })).toBeVisible();
      await expect(page.locator('header').getByText('Sign out', { exact: true })).toBeVisible();
      expect(await page.evaluate(() => localStorage.getItem('wtw-token'))).toBe(user.token);
      expect(api.calls.find((call) => call.method === 'POST' && call.path === '/login')?.body)
        .toEqual({ email: user.email, password: 'Student123' });
    });

    for (const route of ['/mylist', '/films/1/review']) {
      test(`Страница ${route} перенаправляет гостя на вход`, async ({ page }) => {
        await page.goto(`/#${route}`);
        await expect(page).toHaveURL(/#\/login$/);
        await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
        await expect(page.getByLabel('Email address', { exact: true })).toBeVisible();
      });
    }
  });

  test.describe('Авторизованный пользователь', () => {
    test.use({ authenticated: true });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('img', { name: 'User avatar', exact: true })).toBeVisible();
    });

    test('Sign out удаляет токен и закрывает доступ к избранному', async ({ page, api }) => {
      await page.locator('header').getByText('Sign out', { exact: true }).click();
      await expect(page.locator('header').getByText('Sign in', { exact: true })).toBeVisible();
      await expect(page.getByRole('img', { name: 'User avatar', exact: true })).toHaveCount(0);
      expect(await page.evaluate(() => localStorage.getItem('wtw-token'))).toBeNull();
      expect(api.calls.some((call) => call.method === 'DELETE' && call.path === '/logout')).toBe(true);
      // Hash-навигация не перезагружает страницу и не применяет initScript повторно.
      await page.evaluate(() => { window.location.hash = '/mylist'; });
      await expect(page).toHaveURL(/#\/login$/);
      await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
    });
  });
});
