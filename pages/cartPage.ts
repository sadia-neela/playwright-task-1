import { Page } from '@playwright/test';
import BasePage from "../framework/ui/basePage/basePage";
import { Label } from "../framework/ui/elements/Label";
import Element from '../framework/ui/elements/Element';

export type CartProductInfo = {
  name: string;
  price: number;
  quantity: number;
  total: number;
};

export default class CartPage extends BasePage {
  private readonly cartTableRowByProductID: (productId: string) => Element;

  constructor(page: Page) {
    super(page, new Label(page.locator('.cart_info'), 'Shopping Cart header'), 'Cart Page');

    this.cartTableRowByProductID = (productId: string) => new Element(
      page.locator(`//table//tbody//tr[@id="product-${productId}"]`),
      `Cart table row for product ${productId}`
    );
  }

  async getProductInfo(productId: string): Promise<CartProductInfo> {
    const row = this.cartTableRowByProductID(productId).locator;

    const nameLabel = new Label(row.locator('.cart_description h4 a'), `Product name for ${productId}`);
    const priceLabel = new Label(row.locator('.cart_price p'), `Product price for ${productId}`);
    const quantityLabel = new Label(row.locator('.cart_quantity button'), `Product quantity for ${productId}`);
    const totalLabel = new Label(row.locator('.cart_total p'), `Product total for ${productId}`);

    const name = await nameLabel.getText()
    const priceText = await priceLabel.getText();
    const quantityText = await quantityLabel.getText();
    const totalText = await totalLabel.getText();

    return {
      name: name.replaceAll(/\s+/g, '').trim(),
      price: this.parseRupees(priceText),
      quantity: parseInt(quantityText, 10),
      total: this.parseRupees(totalText),
    };
  }

  async isProductTotalCorrect(productId: string): Promise<boolean> {
    const info = await this.getProductInfo(productId);
    return info.total === info.price * info.quantity;
  }

  async isProductInCart(productId: string): Promise<boolean> {
    return await this.cartTableRowByProductID(productId).state.isDisplayed();
  }

  private parseRupees(text: string): number {
    return Number(text.replace(/[^0-9.]/g, ''));
  }
}
