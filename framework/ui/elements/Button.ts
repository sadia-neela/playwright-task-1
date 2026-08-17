import Element from './Element';
import { Locator } from '@playwright/test';

export class Button extends Element {
  constructor(locator: Locator, name: string) {
    super(locator, name);
  }
}
