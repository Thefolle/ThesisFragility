// @ts-nocheck
// 

var selenium = require('selenium-webdriver');

describe('StudyWell UI Tests', function() {

    // Open the web app in the browser before each test is run
    beforeEach(function(done) {
        this.driver = new selenium.Builder().
        withCapabilities(selenium.Capabilities.chrome()).
        build();

        this.driver.get('http://localhost:8000/index.html').then(done);
    });

    // Close the website after each test is run (so that it is opened fresh each time)
    afterEach(function(done) {
        this.driver.quit().then(done);
    });

    // Test to ensure we are on the home page by checking the <body> tag id attribute
    it('Should be on the home page', function(done) {
        var element = this.driver.findElement(selenium.By.tagName('body'));

        element.getAttribute('id').then(function(id) {
            expect(id).toBe('home');
            done();
        });
    });

    // Test the navigation bar and home button page
    it('Has a working nav', function(done) {
        var element = this.driver.findElement(selenium.By.id('hamburger'));

        element.click();

        var menuElement = this.driver.findElement(selenium.By.id('ST'));

        menuElement.click();

        this.driver.getCurrentUrl().then(function(value) {
            expect(value).toContain('/index');
            done();
        });
        
    });

        // Test the navigation bar and schedule button page
        it('Has a working nav', function(done) {
            var element = this.driver.findElement(selenium.By.id('hamburger'));

            element.click();

            var menuElement = this.driver.findElement(selenium.By.id('sched'));

            menuElement.click();

            this.driver.getCurrentUrl().then(function(value) {
                expect(value).toContain('/schedule');
                done();
            });

        });

        // Test the navigation bar and reports button page
        it('Has a working nav', function(done) {
            var element = this.driver.findElement(selenium.By.id('hamburger'));

            element.click();

            var menuElement = this.driver.findElement(selenium.By.id('reps'));

            menuElement.click();

            this.driver.getCurrentUrl().then(function(value) {
                expect(value).toContain('/reports');
                done();
            });

        });

        // Test the navigation bar and settings button page
        it('Has a working nav', function(done) {
            var element = this.driver.findElement(selenium.By.id('hamburger'));

            element.click();

            var menuElement = this.driver.findElement(selenium.By.id('set'));

            menuElement.click();

            this.driver.getCurrentUrl().then(function(value) {
                expect(value).toContain('/settings');
                done();
            });

        });

        // Test the navigation bar and help button page
        it('Has a working nav', function(done) {
            var element = this.driver.findElement(selenium.By.id('hamburger'));

            element.click();

            var menuElement = this.driver.findElement(selenium.By.id('help'));

            menuElement.click();

            this.driver.getCurrentUrl().then(function(value) {
                expect(value).toContain('/help');
                done();
            });

        });

                // Test the navigation bar and survey button page
                it('Has a working nav', function(done) {
                    var element = this.driver.findElement(selenium.By.id('hamburger'));

                    element.click();

                    var menuElement = this.driver.findElement(selenium.By.id('survey'));

                    menuElement.click();

                    this.driver.getCurrentUrl().then(function(value) {
                        expect(value).toContain('/viewform');
                        done();
                    });

                });

            });