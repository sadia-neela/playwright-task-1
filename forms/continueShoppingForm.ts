import BaseForm from '../framework/ui/baseForm/baseForm';
import { Page } from '@playwright/test';
import { Button } from '../framework/ui/elements/Button';

export default class ContinueShoppingForm extends BaseForm {
  private readonly continueShoppingButton: Button;
  private readonly viewCartButton: Button;

  constructor(page: Page) {
    super(page.locator('//div[@id="cartModal"]//div[contains(@class, "modal-content")]'), 'Continue Shopping Form');
    this.continueShoppingButton = new Button(page.locator('//div[contains(@class, "modal-content")]//button'), 'Continue Shopping button');
    this.viewCartButton = new Button(page.locator('//div[contains(@class, "modal-content")]//a[contains(., "View Cart")]'), 'View Cart button');
  }

  async clickContinueShoppingButton(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async clickViewCartButton(): Promise<void> {
    await this.viewCartButton.click();
  }
}
