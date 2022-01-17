// @ts-nocheck
const { $, $$ } = require('../helpers/element-selection.js');

let slowDown = true;
async function waitAWhile() {
  await driver.sleep(slowDown ? 5000 : 0);
}

module.exports = function () {

  this.Given(/^that I search for "([^"]*)" in the search box$/, async function (searchPhrase) {
    let searchBox = await $('input[placeholder="Sök i e-handeln"]');
    await searchBox.sendKeys(searchPhrase);

  });

  this.Given(/^I click ENTER key$/, async function () {
    let searchBox = await $('input[placeholder="Sök i e-handeln"]');
    await searchBox.sendKeys(selenium.Key.ENTER);

  });

  this.Given(/^I get the list of products$/, async function () {
    await driver.wait(until.elementsLocated(by.css('[class^="Grid_grid"]')), 20000);
    let findList = await $$('[class^="Grid_grid"]');
    expect(findList).to.not.equal(null);
    await waitAWhile();

  });

  this.Given(/^I have a list of products in the search result$/, async function () {
    let findResults = await $$('[class^="Grid_grid"]');

    let resultTexts = [];
    for (let findResult of findResults) {
      resultTexts.push(await findResult.getText());
    }
    expect(resultTexts).to.not.equal(0);
  });

  this.Given(/^that the list contains melon galia$/, async function () {
    let findProducts = await $$('[class^="Product_product-name"]');

    let result = [];
    for (let findProduct of findProducts) {
      result.push(await findProduct.getText());
    }
    expect(result).to.include('Melon Galia Klass 1');
    await driver.sleep(3000);
  });

  this.When(/^I click on a melon galia$/, async function () {
    let choseAProduct = await $(('a[href="/produkt/Melon-Galia-Klass-1-101288882_KG"]'), 5000);
    await choseAProduct.click();
    await waitAWhile();
  });

  this.Then(/^by clicking on Övrigt, I should be able to find out more information about given product$/, async function () {
    let productInformation = await $$('.Tabs_bottom__2tvqg');

    let productInfo = productInformation[1];
    await productInfo.click();
    await waitAWhile();

  });

  this.Given(/^that I enter "([^"]*)" in the search bar$/, async function (searchPhrase) {
    let searchBox = await $('input[placeholder="Sök i e-handeln"]');
    await searchBox.sendKeys(searchPhrase);

  });

  this.When(/^I press Enter key$/, async function () {
    let searchBox = await $('input[placeholder="Sök i e-handeln"]');
    await searchBox.sendKeys(selenium.Key.ENTER);
    await waitAWhile();

  });

  this.Then(/^the list of products sould be empty$/, async function () {

    let productList = await $$('[class^="Containerstyles__StyledContainer"]');

    expect(productList).to.equal[0];
    await waitAWhile();
  });

  this.Then(/^I should get a message that says that the searched product does not exist$/, async function () {

    let errorMessages = await $$('[class^="Text_text"]');
    let searchResult = [];

    for (let errorMessage of errorMessages) {
      searchResult.push(await errorMessage.getText());
    }
    expect(searchResult).to.include('Din sökning gav tyvärr ingen träff.');

    await waitAWhile();
  });

};
