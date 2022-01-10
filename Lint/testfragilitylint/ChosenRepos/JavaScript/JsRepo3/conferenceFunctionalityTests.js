// @ts-nocheck
const selenium = require('selenium-webdriver');

describe('Participant functional tests', function() {

    beforeEach(done => {
        this.driver = new selenium.Builder().
            withCapabilities(selenium.Capabilities.safari()).
            build();

        this.driver.get('http://localhost:3000/room/13').then(done);
    });

    afterEach(done => {
        this.driver.quit().then(done);
    });

    it('Modal should not be openend on startup', done => {
        setTimeout(() => {
          this.driver.findElements(selenium.By.className('custom-modal')).then((links) => {
            expect(links.length === 1).toBe(false);
            done();
          });
        }, 200);
    });

    it('Should open modal', done => {
        setTimeout(() => {
          const addNewBtn = this.driver.findElement(selenium.By.tagName('button'));
          addNewBtn.click().then(() => {
            this.driver.findElements(selenium.By.className('custom-modal')).then((links) => {
              expect(links.length).toBe(1);
              done();
            });
          });
        }, 200);
    });

    it('Modal should show error', done => {
        setTimeout(() => {
          const addNewBtn = this.driver.findElement(selenium.By.tagName('button'));
          addNewBtn.click().then(() => {
            this.driver.findElement(selenium.By.className('btn')).click().then(() => {
              this.driver.findElements(selenium.By.className('alert')).then((links) => {
                expect(links.length).toBe(1);
                done();
              });
            });
          });
        }, 200);
    });

});
