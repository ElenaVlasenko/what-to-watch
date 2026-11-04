import { expect, type Page } from '@playwright/test';

export interface LoginPage {
  open(): Promise<void>;
  expectOpened(): Promise<void>;
  submit(email: string, password: string): Promise<void>;
  expectPasswordValidationError(): Promise<void>;
}

export function createLoginPage(page: Page): LoginPage {
  const emailInput = page.getByLabel('Email address', { exact: true });
  const passwordInput = page.getByLabel('Password', { exact: true });
  const submitButton = page.getByRole('button', { name: 'Sign in', exact: true });

  async function expectOpened(): Promise<void> {
    await expect(page).toHaveURL(/#\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in', exact: true }))
      .toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  }

    async function open() {
    await page.goto('./#/login');
    await expectOpened();
  }

  async function submit(email: string, password: string) {
    await emailInput.fill(email);
    await passwordInput.fill(password);
    await submitButton.click();
  }
  async function expectPasswordValidationError() {
    await expect(page.locator('.sign-in__message')).toHaveText(
      'Password must includes at least one digit and one letter.',
    );
    await expectOpened();
  }

  return {
    open,
    expectOpened,
    submit,
    expectPasswordValidationError
  };
}
