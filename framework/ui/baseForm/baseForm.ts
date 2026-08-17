import { Locator, Page, test } from '@playwright/test';
import Timeouts from '../constants/timeouts';
import Element from '../elements/Element';

export default class BaseForm {
  protected readonly form: Element;
  protected readonly name: string;

  /**
   * Initializes a BaseForm with a wrapping element and a name for reporting.
   * @param formElement - A BaseElement identifying the form's root/container
   * @param name - Name of the form for logging/reporting
   */
  constructor(locator: Locator, name: string) {
    this.form = new Element(locator, name);
    this.name = name;
  }

  /**
   * Gets the name of the form.
   */
  get formName(): string {
    return this.name;
  }

  /**
   * Checks if the form is opened using a fast, non-blocking visibility check, encapsulated within a reporting step.
   */
  async isFormOpened(): Promise<boolean> {
    return await test.step(`Form '${this.name}' — Check if opened`, async () => {
      return await this.form.state.isVisible();
    });
  }

  /**
   * Waits for the form to become visible, retrying up to the given timeout, encapsulated within a reporting step.
   */
  async waitForFormToOpen(timeout: number = Timeouts.EXPLICIT_WAIT): Promise<boolean> {
    return await test.step(`Form '${this.name}' — Wait to load`, async () => {
      return await this.form.state.isDisplayed(timeout);
    });
  }
}
