import type { Page } from '@playwright/test';
import { LoadableComponent } from '../components/loadable-component';
import { PageElement } from '../components/page-element';
import type { Credentials } from '../value-objects/credentials';

export class LoginPage extends LoadableComponent {
  private readonly heading: PageElement;
  private readonly emailInput: PageElement;
  private readonly passwordInput: PageElement;
  private readonly submitButton: PageElement;

  constructor(page: Page) {
    super(page);
    this.heading = new PageElement(page.getByRole('heading', { name: 'Sign in', exact: true }));
    this.emailInput = new PageElement(page.getByLabel('Email address', { exact: true }));
    this.passwordInput = new PageElement(page.getByLabel('Password', { exact: true }));
    this.submitButton = new PageElement(page.getByRole('button', { name: 'Sign in', exact: true }));
  }

  open(): Promise<this> {
    return this.load('/#/login');
  }

  async waitForLoaded(): Promise<this> {
    await this.heading.shouldBeVisible();
    await this.emailInput.shouldBeVisible();
    await this.passwordInput.shouldBeVisible();
    return this;
  }

  async enterCredentials(credentials: Credentials): Promise<this> {
    await this.emailInput.fill(credentials.email);
    await this.passwordInput.fill(credentials.password);
    return this;
  }

  async submit(): Promise<this> {
    await this.submitButton.click();
    return this;
  }

  async shouldShowPasswordValidationError(): Promise<this> {
    const message = new PageElement(this.page.locator('.sign-in__message'));
    await message.shouldHaveText('Password must includes at least one digit and one letter.');
    return this;
  }
}
