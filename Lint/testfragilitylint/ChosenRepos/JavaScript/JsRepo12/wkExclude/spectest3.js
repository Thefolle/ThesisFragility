// @ts-nocheck
/**
 * Created by online on 8/12/14.
 */
// spectest3.js
// spec01.js
describe('angularjs homepage', function() {
    it('should add one and two', function() {
        browser.get('http://juliemr.github.io/protractor-demo/');
        element(by.model('first')).sendKeys(3);
        element(by.model('second')).sendKeys(2);

        element(by.id('gobutton')).click();

        expect(element(by.binding('latest')).getText()).
            toEqual('6'); // This is wrong!
        //change 6 to 5 then this is correct
    });
});