// @ts-nocheck
const { $, $$ } = require('../helpers/element-selection.js');

let slowDown = true;

async function waitAWhile() {
  await driver.sleep(slowDown ? 5000 : 0);
}

module.exports = function () {

  this.When(/^I am on "([^"]*)"$/, async function (url) {
    await helpers.loadPage(url);
  });

  this.Given(/^that I have a product in the shopping cart$/, async function () {
    let checkMiniCart = await $('[class^= "ProductListItemstyles__StyledWrapper"]');

    expect(checkMiniCart).to.not.equal(null);
  });

  this.Given(/^I click on the plus button on the product$/, async function () {
    await driver.sleep(1000);
    let clickButton = await $$('[class^= "CardQuantityInputField_quantity-button"]');
    let clickPlusButton = clickButton[1]

    await clickPlusButton.click();
    await waitAWhile();
  });

  this.Given(/^that I click the shopping cart button$/, async function () {

    // be aware, loading shenanigans might ruin this part
    let clickButton = await $('[class^= "MiniCartstyles__StyledMiniCart"]');
    await clickButton.click();

  });

  this.When(/^I click the buy button$/, async function () {
    let clickButton = await $('a[href="https://www.willys.se/varukorg"]');
    await clickButton.click();
  });

  this.Then(/^I should arrive at "([^"]*)"$/, async function (url) {
    await helpers.loadPage(url);
    await waitAWhile();
  });



};