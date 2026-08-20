import { Page } from '@playwright/test';
import BasePage from "../framework/ui/basePage/basePage";
import { Label } from "../framework/ui/elements/Label";
import ContinueShoppingForm from "../forms/continueShoppingForm";
import SingleProductForm from '../forms/singleProductForm';

export default class ProductsPage extends BasePage {

  readonly continueShoppingForm: ContinueShoppingForm;
  readonly singleProductForm: SingleProductForm;

  constructor(page: Page) {
    super(page, new Label(page.locator('#search_product'), 'Search Product Input'), '/products', 'Products Page');
    this.continueShoppingForm = new ContinueShoppingForm(page);
    this.singleProductForm = new SingleProductForm(page, '1');
  }
}
