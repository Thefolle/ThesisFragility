// @ts-nocheck
const selenium = require('selenium-webdriver');

describe('Router tests', function() {

    beforeEach(done => {
        this.driver = new selenium.Builder().
            withCapabilities(selenium.Capabilities.safari()).
            build();

        this.driver.get('http://localhost:3000/').then(done);
    });

    afterEach(done => {
        this.driver.quit().then(done);
    });

    it('Should be on landing page', done => {
        this.driver.getCurrentUrl().then(value => {
            expect(value).toBe('http://localhost:3000/');
            done();
        });
    });

    it('Should be on single room page', done => {
        setTimeout(() => {
          const element = this.driver.findElement(selenium.By.linkText('Check'));
          element.click();
          setTimeout(() => {
            this.driver.getCurrentUrl().then(value => {
                expect(value).toContain('/room/');
                done();
            });
          }, 500);
        }, 500);
    });

    it('Should be on single conference page', done => {
        setTimeout(() => {
          const element = this.driver.findElement(selenium.By.linkText('Check'));
          element.click();
          setTimeout(() => {
            const element2 = this.driver.findElement(selenium.By.className('table-edit-btn'));
            element2.click();
            setTimeout(() => {
              this.driver.getCurrentUrl().then(value => {
                  expect(value).toContain('/conference/');
                  done();
              });
            }, 500);
          }, 500);
        }, 500);
    });
});
