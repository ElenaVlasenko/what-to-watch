import type { Page } from '@playwright/test';
import type { Film } from '../value-objects/film';
import { FilmPage } from './film-page';
import { LoginPage } from './login-page';
import { MainPage } from './main-page';

// Factory: централизует создание Page Object и скрывает конструкторы от тестов.
export class PageFactory {
  constructor(private readonly page: Page) {}

  main(): MainPage {
    return new MainPage(this.page);
  }

  login(): LoginPage {
    return new LoginPage(this.page);
  }

  film(film: Film): FilmPage {
    return new FilmPage(this.page, film);
  }
}
