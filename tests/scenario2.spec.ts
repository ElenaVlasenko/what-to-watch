import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Scenario 2: View movie (headless and no login)', async ({ page }) => {
  // Возвращаемся на главную/хостинг
  await page.goto('/');

  // Выбираем фильм из топа каталога
  const firstFilm = page.locator('.small-film-card').first();
  await firstFilm.waitFor();
  await firstFilm.click();

  // Ожидаем окончания загрузки карточки фильма (появление кнопки Play)
  await expect(page.locator('.btn--play')).toBeVisible();
  
  // Дополнительно ждем полной отработки React и сети
  await page.waitForTimeout(1000);

  // Папка для артефактов
  const artifactsDir = path.join(process.cwd(), 'artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir);
  }

  // Сохраняем скриншот
  const screenshotPath = path.join(artifactsDir, 'screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // Сохраняем HTML страницы
  const htmlPath = path.join(artifactsDir, 'page.html');
  const htmlContent = await page.content();
  fs.writeFileSync(htmlPath, htmlContent);

  console.log('Artifacts saved successfully!');
});
