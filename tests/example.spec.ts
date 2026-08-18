import { test, expect } from '../framework/ui/fixture/browser.fixture';
import HomePage from '../pages/homePage';
import LoginPage from '../pages/loginPage';
import CartPage from '../pages/cartPage';
import ProductsPage from '../pages/productsPage';

test('Create user, add products to cart, verify cart, delete user', async ({ customBrowser: browser, testUser }) => {
  const productID1 = '1';
  const productID2 = '2';

  //go to home page and create user via API
  const homePage = new HomePage(browser.page);
  await homePage.waitForPageToLoad();
  expect(await homePage.isPageOpened(), 'Home page should be opened').toBe(true);

  //click the navbar link to navigate to the login page
  await homePage.clickNavbarLink('Signup / Login');
  const loginPage = new LoginPage(browser.page);
  await loginPage.waitForPageToLoad();
  expect(await loginPage.isPageOpened(), 'Login page should be opened').toBe(true);

  //fill credentials and login
  await loginPage.login(testUser.email, testUser.password);
  await homePage.waitForPageToLoad();
  expect(await homePage.isPageOpened(), 'Home page should be opened after login').toBe(true);
  const isUserNameDisplayed = await homePage.isNavbarLinkDisplayed(`Logged in as ${testUser.name}`);
  expect(isUserNameDisplayed, `User name '${testUser.name}' should be displayed in the navbar after login`).toBe(true);

  //click products page
  await homePage.clickNavbarLink('Products');
  const productsPage = new ProductsPage(browser.page);
  await productsPage.waitForPageToLoad();
  expect(await productsPage.isPageOpened(), 'Products page should be opened').toBe(true);

  //add to cart - product 1
  const productInfo1 = await productsPage.singleProductForm.getProductInfo(productID1);
  await productsPage.singleProductForm.addProductToCart(productID1);
  const isContinueShoppingVisible = await productsPage.continueShoppingForm.waitForFormToOpen();
  expect(isContinueShoppingVisible, 'Continue Shopping button should be visible after adding product 1 to cart').toBe(true);
  console.log(`Product 1 added to cart: Name - ${productInfo1.name}, Price - ${productInfo1.price}`);
  await productsPage.continueShoppingForm.clickContinueShoppingButton();

  //add to cart - product 2
  const productInfo2 = await productsPage.singleProductForm.getProductInfo(productID2);
  await productsPage.singleProductForm.addProductToCart(productID2);
  const isContinueShoppingVisible2 = await productsPage.continueShoppingForm.waitForFormToOpen();
  expect(isContinueShoppingVisible2, 'Continue Shopping button should be visible after adding product 2 to cart').toBe(true);
  console.log(`Product 2 added to cart: Name - ${productInfo2.name}, Price - ${productInfo2.price}`);
  await productsPage.continueShoppingForm.clickViewCartButton();

  // view cart page and verify products
  const cartPage = new CartPage(browser.page);
  await cartPage.waitForPageToLoad();
  expect(await cartPage.isPageOpened(), 'Cart page should be opened').toBe(true);

  // verify product 1 is present and its correct calculation
  expect(await cartPage.isProductInCart(productID1), 'Product 1 should be in cart').toBe(true);
  const cartProduct1 = await cartPage.getProductInfo(productID1);
  console.log(`Product 1 in cart: Name - ${cartProduct1.name}, Price - ${cartProduct1.price}, Quantity - ${cartProduct1.quantity}, Total - ${cartProduct1.total}`);

  expect(cartProduct1.name, 'Product 1 name should match').toBe(productInfo1.name);
  expect(cartProduct1.price, 'Product 1 price is incorrect on cart').toBe(productInfo1.price);
  expect(cartProduct1.quantity, 'Product 1 quantity should be 1').toBe(1);
  expect(await cartPage.isProductTotalCorrect(productID1), 'Product 1 total should equal price × quantity').toBe(true);

  // verify product 2 is present and its correct calculation
  expect(await cartPage.isProductInCart(productID2), 'Product 2 should be in cart').toBe(true);
  const cartProduct2 = await cartPage.getProductInfo(productID2);
  console.log(`Product 2 in cart: Name - ${cartProduct2.name}, Price - ${cartProduct2.price}, Quantity - ${cartProduct2.quantity}, Total - ${cartProduct2.total}`);

  expect(cartProduct2.name, 'Product 2 name should match').toBe(productInfo2.name);
  expect(cartProduct2.price, 'Product 2 price is incorrect on cart').toBe(productInfo2.price);
  expect(cartProduct2.quantity, 'Product 2 quantity should be 1').toBe(1);
  expect(await cartPage.isProductTotalCorrect(productID2), 'Product 2 total should equal price × quantity').toBe(true);
});
