import { Page } from '@playwright/test';
import BasePage from "../framework/ui/basePage/basePage";
import { Label } from "../framework/ui/elements/Label";
import { Button } from "../framework/ui/elements/Button";
import { TextBox } from "../framework/ui/elements/TextBox";

export default class LoginPage extends BasePage {
  private readonly loginButton: Button;
  private readonly emailTextBox: TextBox;
  readonly passwordTextBox: TextBox;

  constructor(page: Page) {
    super(page, new Label(page.locator('//h2[contains(., "Login to your account")]'), 'Login to your account header'), '/login', 'Login Page');
    this.loginButton = new Button(page.locator('//form[@action="/login"]//button[contains(., "Login")]'), 'Login button');
    this.emailTextBox = new TextBox(page.locator('//form[@action="/login"]//input[@name="email"]'), 'Email text box');
    this.passwordTextBox = new TextBox(page.locator('//form[@action="/login"]//input[@name="password"]'), 'Password text box');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailTextBox.setText(email);
    await this.passwordTextBox.setText(password);
    await this.loginButton.click();
  }
}
