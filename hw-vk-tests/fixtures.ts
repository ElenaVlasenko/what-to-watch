import { test as base } from '@playwright/test';
import { createCatalogPage, type CatalogPage } from './pages/catalog-page';
import { createFilmPage, type FilmPage } from './pages/film-page';
import { createLoginPage, type LoginPage } from './pages/login-page';

interface PageObjects {
  catalogPage: CatalogPage;
  filmPage: FilmPage;
  loginPage: LoginPage;
}

export const test = base.extend<PageObjects>({
  catalogPage: async ({ page }, use) => {
    await use(createCatalogPage(page));
  },
  filmPage: async ({ page }, use) => {
    await use(createFilmPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(createLoginPage(page));
  },
});
