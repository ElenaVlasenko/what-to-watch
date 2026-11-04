# Автотесты: домашнее задание 4

UI-тесты опубликованного сайта
<https://elenavlasenko.github.io/what-to-watch/> на Playwright и TypeScript:

1. Загрузка каталога и активный жанр All genres.
2. Открытие выбранного фильма из каталога.
3. Переключение на Details и проверка сведений о фильме.
4. Переход к форме входа через Sign in.
5. Проверка ошибки пароля без цифр.

Используются настоящий API и чистый браузерный контекст для каждого теста.
Для запуска необходим доступ к сайту и его API. Тесты не авторизуются и не
изменяют данные на сервере. Название фильма берётся из текущего каталога.

## Подготовка

Из корня репозитория, с Node.js 24 LTS и npm:

```bash
npm ci
npx playwright install chromium
```

На Linux при отсутствии системных библиотек:

```bash
npx playwright install --with-deps chromium
```

## Запуск

```bash
npm run typecheck:hw4
npm run test:hw4
npm run test:hw4:headed
```

Обнаружение тестов и повторный прогон:

```bash
npm run test:hw4 -- --list
npm run test:hw4 -- --repeat-each=2
```

## Отчёт и диагностика

```bash
npx playwright show-report hw-vk-tests/playwright-report
```

При падении скриншот и trace сохраняются в `hw-vk-tests/test-results/` и
доступны из HTML-отчёта. Отчёты и результаты исключены из Git.
Trace также можно открыть отдельно:

```bash
npx playwright show-trace <путь-к-trace.zip>
```

## Организация

- `pages/`: фабрики отдельных типизированных Page Objects. Локаторы и `Page`
  скрыты в замыканиях; наружу доступны действия и проверки поведения.
- `fixtures.ts`: создание объектов для каждого теста.
- `specs/`: сценарии без прямых обращений к локаторам.
- `playwright.config.ts`: отдельный запуск Chromium без локального сервера.
- `tsconfig.json`: строгая проверка типов всего набора, включая конфигурацию.

Существующие тесты в `tests/` и их конфигурация запускаются отдельно.
