import BaseForm from '../framework/ui/baseForm/baseForm';
import { Page } from '@playwright/test';
import { Button } from '../framework/ui/elements/Button';
import { Label } from '../framework/ui/elements/Label';
import regexConstants from '../framework/ui/constants/regexConstants';
import { parseRupees } from '../framework/utils/testUtils';

export default class SingleProductForm extends BaseForm {
  private readonly productImageByProductId: (productId: string) => Button;
  private readonly addToCartButtonByProductIdOnOverlay: (productId: string) => Button;
  private readonly productPriceByProductId: (productId: string) => Label;
  private readonly productNameByProductId: (productId: string) => Label;

  constructor(page: Page, productId: string) {
    super(page.locator(`//div[contains(@class, "productinfo")]//a[@data-product-id="${productId}"]`), 'Single Product Form');
    this.productImageByProductId = (productId) => new Button(page.locator(`//div[contains(@class, "productinfo")]//a[@data-product-id="${productId}"]/preceding-sibling::img`), `Product image for product ID ${productId}`);
    this.addToCartButtonByProductIdOnOverlay = (productId: string) => new Button(
      page.locator(`//div[contains(@class, "product-overlay")]//a[@data-product-id="${productId}"]`),
      `Add to cart button for product ID ${productId} on overlay`
    );
    this.productPriceByProductId = (productId: string) => new Label(
      page.locator(`//div[contains(@class, "product-overlay")]//a[@data-product-id="${productId}"]/preceding-sibling::h2`),
      `Product price for product ID ${productId}`
    );
    this.productNameByProductId = (productId: string) => new Label(
      page.locator(`//div[contains(@class, "product-overlay")]//a[@data-product-id="${productId}"]/preceding-sibling::p`),
      `Product name for product ID ${productId}`
    );  
  }

  async addProductToCart(productId: string): Promise<void> {
    await this.productImageByProductId(productId).scrollIntoView();
    await this.productImageByProductId(productId).moveTo();
    await this.addToCartButtonByProductIdOnOverlay(productId).waitForDisplayed();
    await this.addToCartButtonByProductIdOnOverlay(productId).clickViaJS();
  }

  async getProductInfo(productId: string): Promise<{ name: string; price: number }> {
    const name = await this.productNameByProductId(productId).getText();
    const price = await this.productPriceByProductId(productId).getText();
    return { name, price: parseRupees(price, regexConstants.digitsOnly) };
  }
}
