// @ts-nocheck
const { $, $$ } = require('../helpers/element-selection.js');

let slowDown = true;

async function waitAWhile() {
  await driver.sleep(slowDown ? 5000 : 0);
}

module.exports = function () {

  this.When(/^a product is added to the shopping cart$/, async function () {

    let checkCartItems = await $$('.md-list-item-text');
    let itemResult = checkCartItems[0];

    expect(itemResult);
    await waitAWhile();
  });

  this.When(/^I click the remove button$/, async function () {
    let clickButton = await $('.ax-product-remove');
    await clickButton.click();
    await waitAWhile();
  });

  this.When(/^click the following confirmation button$/, async function () {
    let clickButton = await $$('.ax-btn-primary');
    let primaryButton = clickButton[6];

    await primaryButton.click();
    await waitAWhile();
  });

  this.Then(/^the product should be removed$/, async function () {

    let checkCartItems = await $$('.md-list-item-text');

    expect(checkCartItems).to.equal[0];
  });

  this.Then(/^the shopping cart should be empty$/, async function () {

    let checkEmptyCart = await $('h1').getText();

    expect(checkEmptyCart).to.include('Din varukorg är tom!');
    await waitAWhile();
  });


};