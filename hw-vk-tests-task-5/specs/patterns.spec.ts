import { test, expect } from '../fixtures';
import { user } from '../data';
import { AuthDataProvider } from '../data-provider';
import { dataRegistry } from '../data-registry';

const allFilms = dataRegistry.allFilms();

test.describe('Паттерны проектирования автотестов', { tag: '@patterns' }, () => {
  test('Вход через Page Object и цепочку вызовов', { tag: '@smoke' }, async ({ pages, page, api }) => {
    const credentials = AuthDataProvider.validCredentials();
    const loginPage = await pages.login().open();
    await (await loginPage.enterCredentials(credentials)).submit();
    const mainPage = await pages.main().waitForLoaded();

    await mainPage.shouldBeAuthenticated();
    await expect(page).toHaveURL(/#\/$/);
    expect(await page.evaluate(() => localStorage.getItem('wtw-token'))).toBe(user.token);
    expect(api.calls.find((call) => call.method === 'POST' && call.path === '/login')?.body)
      .toEqual({ email: credentials.email, password: credentials.password });
  });

  for (const data of AuthDataProvider.invalidPasswords()) {
    test(`Data Provider: пароль ${data.description} отклоняется`, async ({ pages, page, api }) => {
      const loginPage = await pages.login().open();
      await (await loginPage.enterCredentials(data.credentials)).submit();

      await loginPage.shouldShowPasswordValidationError();
      await expect(page).toHaveURL(/#\/login$/);
      expect(api.calls.filter((call) => call.method === 'POST' && call.path === '/login')).toEqual([]);
    });
  }

  test('Каталог раскрывается и открывает выбранный фильм', async ({ pages }) => {
    const selectedFilm = dataRegistry.film('3');
    const mainPage = await pages.main().open();

    await mainPage.shouldDisplayFilms(allFilms.slice(0, 8));
    await (await mainPage.showAllFilms()).shouldDisplayFilms(allFilms);

    const filmPage = await mainPage.openFilm(selectedFilm);
    await filmPage.shouldHaveDescription(selectedFilm.description);
  });
});
