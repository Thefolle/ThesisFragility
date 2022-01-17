// @ts-nocheck
const { $, $$ } = require('../helpers/element-selection.js');

let slowDown = true;

async function waitAWhile() {
  await driver.sleep(slowDown ? 5000 : 0);
}


module.exports = function () {

  this.Given(/^the shopping cart menu is open$/, async function () {
    let clickButton = await $('[class^= "ax-btn ax-btn-fab ax-toolbar-btn"]');
    await clickButton.click();
  });

  this.When(/^I click the buy-button$/, async function () {
    let clickButton = await $('a[class^= "ax-btn ax-btn-primary"]');
    await clickButton.click();
  });

  this.When(/^I click on the plus button on the product in the side menu$/, async function () {
    let clickButton = await $$('[class^= "ax-btn ax-product-quantity-btn ax-product-quantity-plus"]');
    let confirmButton = clickButton[0];
    await confirmButton.click();
    await waitAWhile();
  });

  this.When(/^I click on the minus button on the product in the side menu$/, async function () {
    let clickButton = await $$('[class^= "ax-btn ax-product-quantity-btn"]');
    let confirmButton = clickButton[0];
    await confirmButton.click();
    await waitAWhile();
  });

  this.Then(/^the product count should be increased in the side menu$/, async function () {
    let findResults = await $$('#selenium--cart-badge-total-unit-count');
    let resultTexts = [];
    for (let findResult of findResults) {
      resultTexts.push(await findResult.getText());
    }
    expect(resultTexts).to.eql(['3']);
    let h2Text;
    while (h2Text !== '3') {
      h2Text = await (await driver.findElement(By.css('#selenium--cart-badge-total-unit-count'))).getText();
      await driver.sleep(100);
    }
  });

  this.Then(/^the product count should be decreased in the side menu$/, async function () {
    let findResults = await $$('#selenium--cart-badge-total-unit-count');
    let resultTexts = [];
    for (let findResult of findResults) {
      resultTexts.push(await findResult.getText());
    }
    expect(resultTexts).to.eql(['1']);
    let h2Text;
    while (h2Text !== '1') {
      h2Text = await (await driver.findElement(By.css('#selenium--cart-badge-total-unit-count'))).getText();
      await driver.sleep(100);
    }
  });

  this.Then(/^I click on the plus button on the product in the shopping cart$/, async function () {
    let clickButton = await $$('[class^= "ax-btn ax-product-quantity-btn"]');
    let confirmButton = clickButton[1];
    await confirmButton.click();
  });

  this.Then(/^I click on the minus button on the product in the shopping cart$/, async function () {
    let clickButton = await $$('[class^= "ax-btn ax-product-quantity-btn"]');
    let confirmButton = clickButton[0];
    await confirmButton.click();
  });

  this.Then(/^the product count should be increased in the shopping cart$/, async function () {
    let h2Text;
    while (h2Text !== '3') {
      h2Text = await (await driver.findElement(By.css('.ax-cart-mini .ax-badge.ax-badge-info'))).getText();
      await driver.sleep(100);
    }
    let findResults = await $$('.ax-cart-mini .ax-badge.ax-badge-info');
    let resultTexts = [];
    for (let findResult of findResults) {
      resultTexts.push(await findResult.getText());
    }
    expect(resultTexts).to.eql(['3']);
  });

  this.Then(/^the product count should be decreased in the shopping cart$/, async function () {
    let h2Text;
    while (h2Text !== '1') {
      h2Text = await (await driver.findElement(By.css('.ax-cart-mini .ax-badge.ax-badge-info'))).getText();
      await driver.sleep(100);
    }
    let findResults = await $$('.ax-cart-mini .ax-badge.ax-badge-info');
    let resultTexts = [];
    for (let findResult of findResults) {
      resultTexts.push(await findResult.getText());
    }
    expect(resultTexts).to.eql(['1']);
  });

};