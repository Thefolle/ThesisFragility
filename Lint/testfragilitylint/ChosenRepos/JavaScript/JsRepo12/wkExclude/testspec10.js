// @ts-nocheck
/**
 * Created by online on 11/12/14.
 */
describe('angularjs homepage', function() {
    it('should have a title', function() {
        browser.get('http://angularjs.org/');

        expect(browser.getTitle()).toContain('AngularJS');
    });
});