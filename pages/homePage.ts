import { Page } from '@playwright/test';
import BasePage from "../framework/ui/basePage/basePage";
import { Label } from "../framework/ui/elements/Label";

export default class HomePage extends BasePage {

  constructor(page: Page) {
    super(page, new Label(page.locator('#slider-carousel'), 'Slider carousel'), '/', 'Home Page');
  }
}
