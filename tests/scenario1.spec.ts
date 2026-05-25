import { test, expect } from '@playwright/test';

test.use({ headless: false }); // Scenario 1 runs with UI (headed)

test('Scenario 1: Add to favorites', async ({ page }) => {
  // 1. Возвращаемся на главную/хостинг
  await page.goto('./');

  // Авторизуемся для возможности добавлять в избранное
  await page.click('text=Sign in');
  
  // Учетные данные пользователя, подходящие под валидацию
  await page.fill('input[type="email"]', 'login@gmail.com'); 
  await page.fill('input[type="password"]', 'student1'); 
  await page.click('button[type="submit"]');

  // Ждем редиректа на главную и успешной авторизации
  await expect(page.locator('text=Sign out')).toBeVisible();

  // 2-3. Выбираем фильм из топа каталога
  const firstFilm = page.locator('.small-film-card').first();
  await firstFilm.waitFor();
  await firstFilm.click();

  // Ожидаем отрисовки карточки фильма
  const favoriteBtn = page.locator('.btn--list');
  await favoriteBtn.waitFor();

  // 4. Проверяем стоит ли лайк
  const svgUse = favoriteBtn.locator('svg use');
  const href = await svgUse.getAttribute('href') || await svgUse.getAttribute('xlink:href');

  if (href === '#in-list') {
    // Если лайк уже стоял, убираем его
    await favoriteBtn.click();
    await page.waitForTimeout(1000); // Ждем ответа API
    
    // Обновляем страницу 
    await page.reload();
    await favoriteBtn.waitFor();
    await page.waitForTimeout(500);
    
    // И ставим заново
    await favoriteBtn.click();
    await page.waitForTimeout(1000);
  } else {
    // Если еще не стоял, то ставим
    await favoriteBtn.click();
    await page.waitForTimeout(1000);
  }

  // 5. Обновляем страницу и проверяем, что лайк стоит
  await page.reload();
  await favoriteBtn.waitFor();

  const finalHref = await svgUse.getAttribute('href') || await svgUse.getAttribute('xlink:href');
  expect(finalHref).toBe('#in-list');

  // Пауза, чтобы браузер не закрылся сразу
  await page.pause();
});
