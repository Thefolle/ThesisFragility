// @ts-nocheck
const { $, $$ } = require('../helpers/element-selection.js');

let slowDown1 = false;
async function waitAWhile() {
  await driver.sleep(slowDown1 ? 5000 : 0);
}


module.exports = function () {

  this.Given(/^that the side menu is open$/, async function () {
    await driver.wait(until.elementsLocated(by.css('.ax-sidemenu')), 10000);
    let sidemenu = await $('.ax-sidemenu');
    expect(sidemenu).to.not.equal(null);

  })


  this.When(/^I click on the meat, poultry and butchers' category$/, async function () {
    let meatButton = await $$('.axsidemenu-toggle');
    let clickbutton = meatButton[0];
    await clickbutton.click();

    await waitAWhile();

    let h2Text;
    while (h2Text !== 'Kött, chark & fågel') {
      h2Text = await (await driver.findElement(By.css('h2'))).getText();
      await driver.sleep(100);
    }
  });

  this.When(/^I click on the Meat subcategory$/, async function () {

    let meatButton2 = await $('a[href="/sortiment/kott-chark-och-fagel/kott"]');

    await meatButton2.click();
    await waitAWhile();

    let h2Text;
    while (h2Text !== 'Kött') {
      h2Text = await (await driver.findElement(By.css('h2'))).getText();
      await driver.sleep(100);
    }

  });

  this.Then(/^I should see all the products with the meat tag$/, async function () {

    let findResults = await $$('[class^= "Headingstyles__StyledH2"]');
    let resultTexts = [];
    for (let findResult of findResults) {
      resultTexts.push(await findResult.getText());
    }
    expect(resultTexts).to.include('Kött');
    await waitAWhile();

  })


  this.Then(/^be able to find ground beef in the list$/, async function () {

    let findResults = await $$('[class^= "Product_product-name"]');
    let resultTexts = [];
    for (let findResult of findResults) {
      resultTexts.push(await findResult.getText());
    }

    //you can check for any product name on the page for testing!
    expect(resultTexts).to.include('Nötfärs 12% Sverige');
  });

  // This is where we go to check for vegetables instead :)

  this.When(/^I click on the Vegetables and Greens category$/, async function () {
    let vegetableButton = await $$('.axsidemenu-toggle');
    let clickbutton = vegetableButton[1];
    await clickbutton.click();
    await waitAWhile();

    let h2Text;
    while (h2Text !== 'Frukt & Grönt') {
      h2Text = await (await driver.findElement(By.css('h2'))).getText();
      await driver.sleep(100);
    }
  });

  this.When(/^I click on the Vegetables subcategory$/, async function () {

    let vegetableButton2 = await $('a[href="/sortiment/frukt-och-gront/gronsaker"]');
    await vegetableButton2.click();
    await waitAWhile();

    let h2Text;
    while (h2Text !== 'Grönsaker') {
      h2Text = await (await driver.findElement(By.css('h2'))).getText();
      await driver.sleep(100);
    }
  });

  this.Then(/^I should see all the products with the vegetable tag$/, async function () {
    let findResults = await $$('[class^= "Headingstyles__StyledH2"]');

    let resultTexts = [];
    for (let findResult of findResults) {
      resultTexts.push(await findResult.getText());
    }
    expect(resultTexts).to.include('Grönsaker');
    await waitAWhile();

  });


  this.Then(/^be able to find avocados in the list$/, async function () {

    let findResults = await $$('[class^= "Product_product-name"]');
    let resultTexts = [];
    for (let findResult of findResults) {
      resultTexts.push(await findResult.getText());
    }
    expect(resultTexts).to.include('Avokado Klass 1');
  })
};



