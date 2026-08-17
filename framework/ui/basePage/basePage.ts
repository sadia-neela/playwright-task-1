import { Page, test } from '@playwright/test';
import Timeouts from '../constants/timeouts';
import BaseElement from '../elements/Element';
import { Button } from '../elements';

export default class BasePage {
  protected readonly uniqueElement: BaseElement;
  navbarNavLink: (linkName: string) => Button;
  protected readonly _name: string;

  /**
   * Initializes a BasePage with a unique element to identify it and a name for reporting.
   * @param page - Playwright page used to create shared page locators
   * @param uniqueElement - A unique element that identifies the page
   * @param name - Name of the page for logging/reporting
   */
  constructor(page: Page, uniqueElement: BaseElement, name: string) {
    if (!(uniqueElement instanceof BaseElement)) {
      throw new Error('uniqueElement must be a child of BaseElement');
    }
    this.uniqueElement = uniqueElement;
    this.navbarNavLink = (linkName: string) => new Button(page.locator(`//ul[contains(@class, "navbar-nav")]//a[contains(., "${linkName}")]`), `Navbar link '${linkName}'`);
    this._name = name;
  }

  /**
   * Gets the name of the page.
   */
  get name(): string {
    return this._name;
  }
  /**
   * Waits for the page to load by waiting for its unique element to be displayed, encapsulated within a reporting step.
   */
  async waitForPageToLoad(timeout: number = Timeouts.WAIT_PAGE_LOAD): Promise<void> {
    await test.step(`Page '${this._name}' — Wait to load`, async () => {
      await this.uniqueElement.waitForDisplayed(timeout);
    });
  }

  /**
   * Checks if the page is opened using a fast non-blocking visibility check, encapsulated within a reporting step.
   */
  async isPageOpened(): Promise<boolean> {
    return await test.step(`Page '${this._name}' — Check if opened`, async () => {
      return await this.uniqueElement.state.isVisible();
    });
  }

  async isNavbarLinkDisplayed(linkName: string): Promise<boolean> {
    const link = this.navbarNavLink(linkName);
    return await test.step(`Page '${this._name}' — Check if navbar link '${linkName}' is displayed`, async () => {
      return await link.state.isDisplayed();
    });
  }

  async clickNavbarLink(linkName: string): Promise<void> {
    const link = this.navbarNavLink(linkName);
    await test.step(`Page '${this._name}' — Click navbar link '${linkName}'`, async () => {
      await link.click();
    });
  }
}
