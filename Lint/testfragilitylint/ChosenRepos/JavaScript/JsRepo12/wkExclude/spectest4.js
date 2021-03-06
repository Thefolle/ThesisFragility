// @ts-nocheck
/**
 * Created by online on 8/12/14.
 */
// spectest4.js
describe('angularjs homepage', function() {
    var firstNumber = element(by.model('first'));
    var secondNumber = element(by.model('second'));
    var goButton = element(by.id('gobutton'));
    var latestResult = element(by.binding('latest'));

    beforeEach(function() {
        browser.get('http://juliemr.github.io/protractor-demo/');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Super Calculator');
    });

    it('should add one and two', function() {
        firstNumber.sendKeys(1);
        secondNumber.sendKeys(2);

        goButton.click();

        expect(latestResult.getText()).toEqual('3');
    });

    it('should add four and six', function() {
        // Fill this in.
        secondNumber.sendKeys(4);
        firstNumber.sendKeys(6);

        goButton.click();
        expect(latestResult.getText()).toEqual('10');
    });
});