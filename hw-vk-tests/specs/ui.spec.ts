import { test } from '../fixtures';

test('Главная страница показывает каталог и активный жанр All genres', async ({ catalogPage }) => {
  await catalogPage.open();
  await catalogPage.expectLoaded();
});

test('Карточка каталога открывает выбранный фильм', async ({ catalogPage, filmPage }) => {
  await catalogPage.open();
  const name = await catalogPage.openFirstFilm();
  await filmPage.expectOpened(name);
});

test('Вкладка Details показывает сведения о фильме', async ({ catalogPage, filmPage }) => {
  await catalogPage.open();
  const name = await catalogPage.openFirstFilm();
  await filmPage.expectOpened(name);
  await filmPage.openDetails();
  await filmPage.expectDetails();
});

test('Sign in в шапке открывает форму входа', async ({ catalogPage, loginPage }) => {
  await catalogPage.open();
  await catalogPage.openSignIn();
  await loginPage.expectOpened();
});

test('Пароль без цифр вызывает ошибку валидации', async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.submit('student@example.com', 'letters');
  await loginPage.expectPasswordValidationError();
});
