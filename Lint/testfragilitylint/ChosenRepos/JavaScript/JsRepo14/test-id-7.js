// @ts-nocheck
const { $, $$ } = require('../helpers/element-selection.js');

let slowDown = true;

async function waitAWhile() {
  await driver.sleep(slowDown ? 5000 : 0);
}
module.exports = function () {

 
  this.When(/^the shopping cart side menu is open$/, async function () {
    let clickShoppingCart = await $('[class^= "ax-btn ax-btn-fab ax-toolbar-btn"]');
    await clickShoppingCart.click();

    await waitAWhile();
  });

  this.When(/^I click the empty button$/, async function () {
    
    let clickButton = await $('[arialabel="cart.page.clear.all"]');
    await clickButton.click();
    await waitAWhile();
  });

  this.When(/^click the confirmation button$/, async function () {

    let clickButton = await $('[class^= "ax-btn-primary md-button md-ink-ripple"]');
    await clickButton.click();
    await waitAWhile();
  });

  this.Then(/^an empty shopping cart will be shown$/, async function () {

    let checkEmptyCart = await $('h3').getText();

    expect(checkEmptyCart).to.include('Din varukorg är tom!');
    await waitAWhile();
  });

}