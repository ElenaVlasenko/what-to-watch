import { test as base, expect } from '@playwright/test';
import { comments, films, initialFavorite, promo, user } from './data';

interface ApiCall {
  method: string;
  path: string;
  body: unknown;
}

interface Fixtures {
  authenticated: boolean;
  api: { calls: ApiCall[]; unexpected: string[] };
}

export const test = base.extend<Fixtures>({
  authenticated: [false, { option: true }],
  api: [async ({ page, authenticated }, use) => {
    let signedIn = authenticated;
    let favorites = [initialFavorite];
    const calls: ApiCall[] = [];
    const unexpected: string[] = [];

    if (authenticated) {
      await page.addInitScript((token) => {
        localStorage.setItem('wtw-token', token);
      }, user.token);
    }

    await page.route('https://15.design.htmlacademy.pro/wtw/**', async (route) => {
      const request = route.request();
      const path = new URL(request.url()).pathname.replace('/wtw', '');
      const method = request.method();
      calls.push({ method, path, body: request.postDataJSON() as unknown });

      if (method === 'GET' && path === '/films') {
        await route.fulfill({ json: films });
      } else if (method === 'GET' && path === '/promo') {
        await route.fulfill({ json: promo });
      } else if (path === '/login' && method === 'POST') {
        signedIn = true;
        await route.fulfill({ json: user });
      } else if (path === '/login' && method === 'GET') {
        await route.fulfill(signedIn
          ? { json: user }
          : { status: 401, json: { message: 'Unauthorized' } });
      } else if (path === '/logout' && method === 'DELETE') {
        signedIn = false;
        await route.fulfill({ status: 204 });
      } else if (path === '/favorite' && method === 'GET' && signedIn) {
        await route.fulfill({ json: favorites });
      } else if (/^\/favorite\/\d+\/[01]$/.test(path) && method === 'POST' && signedIn) {
        const [, , id, status] = path.split('/');
        const film = films.find((item) => item.id === id);
        if (!film) {
          unexpected.push(`${method} ${path}`);
          await route.fulfill({ status: 404, json: { message: 'Film not found' } });
          return;
        }
        const isFavorite = status === '1';
        favorites = favorites.filter((item) => item.id !== id);
        if (isFavorite) favorites.push(film);
        await route.fulfill({ json: { ...film, isFavorite } });
      } else if (/^\/films\/\d+\/similar$/.test(path) && method === 'GET') {
        const id = path.split('/')[2];
        await route.fulfill({ json: films.filter((film) => film.id !== id).slice(0, 5) });
      } else if (/^\/films\/\d+$/.test(path) && method === 'GET') {
        const film = films.find((item) => item.id === path.split('/')[2]);
        await route.fulfill(film
          ? { json: film }
          : { status: 404, json: { message: 'Film not found' } });
      } else if (/^\/comments\/\d+$/.test(path) && method === 'GET') {
        await route.fulfill({ json: comments });
      } else {
        unexpected.push(`${method} ${path}`);
        await route.fulfill({ status: 501, json: { message: 'Unexpected test API request' } });
      }
    });

    // Проверяем навигацию плеера, а не загрузку и декодирование видео.
    await page.route('**/hw5-*.mp4', (route) => route.fulfill({ status: 204 }));
    await use({ calls, unexpected });
    await page.unrouteAll({ behavior: 'wait' });
  }, { auto: true }],
});

// Аналог @AfterEach: журнал запросов становится вложением HTML-отчета.
test.afterEach(async ({ api, page }, testInfo) => {
  await testInfo.attach('api-calls', {
    body: JSON.stringify({ url: page.url(), calls: api.calls }, null, 2),
    contentType: 'application/json',
  });
  expect(api.unexpected, 'Все запросы API должны быть предусмотрены фикстурой').toEqual([]);
});

export { expect };
