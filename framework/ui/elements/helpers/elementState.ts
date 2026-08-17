import { test, expect, Locator } from '@playwright/test';
import Timeouts from '../../constants/timeouts';

export default class ElementStateHandler {
  private readonly _locator: Locator;
  private readonly _name: string;

  /**
   * Initializes the state handler for an element.
   * @param locator
   * @param name
   */
  constructor(locator: Locator, name: string) {
    this._locator = locator;
    this._name = name;
  }

  /**
   * Internal error handler.
   * Deterministically identifies timeouts using strictly typed error names
   * and specific Playwright assertion patterns, avoiding fragile substring matches.
   */
  private _handleError(error: unknown): boolean {
    if (error instanceof Error && 'matcherResult' in error) {
      return false;
    }
    throw error;
  }

  /**
   * Checks if the element is enabled, encapsulated within a reporting step.
   */
  async isEnabled(timeout: number = Timeouts.EXPLICIT_WAIT): Promise<boolean> {
    return await test.step(`State check: Is '${this._name}' enabled?`, async () => {
      try {
        await expect(this._locator).toBeEnabled({ timeout });
        return true;
      } catch (error) {
        return this._handleError(error);
      }
    });
  }

  /**
   * Checks if the element is displayed, encapsulated within a reporting step.
   */
  async isDisplayed(timeout: number = Timeouts.EXPLICIT_WAIT): Promise<boolean> {
    return await test.step(`State check: Is '${this._name}' displayed?`, async () => {
      try {
        await expect(this._locator).toBeVisible({ timeout });
        return true;
      } catch (error) {
        return this._handleError(error);
      }
    });
  }

  /**
   * Performs a zero-timeout, non-retrying visibility snapshot, encapsulated within a reporting step.
   * Unlike isDisplayed(), this does NOT auto-retry — it returns the element's visibility at the instant of the call.
   */
  async isVisible(): Promise<boolean> {
    return await test.step(`State check: Is '${this._name}' visible? (instant)`, async () => {
      return await this._locator.isVisible();
    });
  }

  /**
   * Checks if the element is clickable, encapsulated within a reporting step.
   */
  async isClickable(timeout: number = Timeouts.EXPLICIT_WAIT): Promise<boolean> {
    return await test.step(`State check: Is '${this._name}' clickable?`, async () => {
      try {
        await expect(this._locator).toBeVisible({ timeout });
        await expect(this._locator).toBeEnabled({ timeout });
        return true;
      } catch (error) {
        return this._handleError(error);
      }
    });
  }

  /**
   * Checks if the element is selected, encapsulated within a reporting step.
   */
  async isSelected(timeout: number = Timeouts.EXPLICIT_WAIT): Promise<boolean> {
    return await test.step(`State check: Is '${this._name}' selected?`, async () => {
      try {
        await expect(this._locator).toBeChecked({ timeout });
        return true;
      } catch (error) {
        return this._handleError(error);
      }
    });
  }

  /**
   * Checks if the element is present in the DOM, encapsulated within a reporting step.
   */
  async isPresent(): Promise<boolean> {
    return await test.step(`State check: Is '${this._name}' present?`, async () => {
      try {
        return (await this._locator.count()) > 0;
      } catch (error) {
        return this._handleError(error);
      }
    });
  }
}