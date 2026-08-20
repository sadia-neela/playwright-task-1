import { test , Locator} from '@playwright/test';
import ElementStateHandler from './helpers/elementState';
import Timeouts from '../constants/timeouts';

export default class Element {
  protected readonly _locator: Locator;
  protected readonly _name: string;

  constructor(locator: Locator, name: string) {
    this._locator = locator;
    this._name = name;
  }

  get locator(): Locator {
    return this._locator;
  }

  get state(): ElementStateHandler {
    return new ElementStateHandler(this._locator, this._name);
  }

  async click(): Promise<void> {
    await test.step(`Action: Click on '${this._name}'`, async () => {
      await this._locator.click();
    });
  }

  async getText(): Promise<string> {
    return await test.step(`Action: Get text from '${this._name}'`, async () => {
      await this.waitForDisplayed();
      const text = await this._locator.innerText();
      test.info().annotations.push({
        type: 'text',
        description: `Text from '${this._name}': "${text}"`,
      });
      return text;
    });
  }

    /**
   * Moves the mouse cursor over the element encapsulated within a reporting step.
   */
  async moveTo(): Promise<void> {
    await test.step(`Hover over '${this._name}'`, async () => {
      await this._locator.hover();
    });
  }

  /**
   * Waits for the element to become visible encapsulated within a reporting step.
   */
  async waitForDisplayed(timeout: number = Timeouts.EXPLICIT_WAIT): Promise<void> {
    await test.step(`Wait for '${this._name}' to be displayed for ${timeout} ms`, async () => {
      await this._locator.waitFor({ state: 'visible', timeout });
    });
  }

  /**
   * Scrolls the element into view encapsulated within a reporting step.
   */
  async scrollIntoView(): Promise<void> {
    await test.step(`Scroll '${this._name}' into view`, async () => {
      await this._locator.scrollIntoViewIfNeeded();
    });
  }

  async clickViaJS(): Promise<void> {
    await test.step(`Action: Click on '${this._name}' via JavaScript`, async () => {
      await this._locator.evaluate((element) => {
        (element as HTMLElement).click();
      });
    });
  }
}
