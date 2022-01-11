// @ts-nocheck
require('dotenv').config();
var selenium = require('selenium-webdriver');
jasmine.getEnv().defaultTimeoutInterval = 10000;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('Check if login successful', function() {

  var url = 'http://localhost:';
  var port = process.env.APP_PORT;
  var baseUrl = url + port;
  var user = process.env.DB_USER;
  var password = process.env.DB_PASS;

  beforeEach(function(done) {
    this.driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();
    this.driver.manage().timeouts().setScriptTimeout(10000);
    this.driver.manage().window().maximize();
    this.driver.get(baseUrl).then(done);
  });

  afterEach(function(done) {
    this.driver.quit().then(done);
  });

  it('is user able to login with correct credentials to application', function(done) {

    this.driver.findElement(selenium.By.css("input.form-control:nth-child(2)")).sendKeys(user);
    this.driver.findElement(selenium.By.css("input.form-control:nth-child(1)")).sendKeys(password);
    this.driver.findElement(selenium.By.css(".btn")).click();
    var element = this.driver.wait(selenium.until.elementLocated(selenium.By.css("#sticky-footer")), 10000);

    element.getAttribute('id').then(function(id) {
      expect(id).toBe('sticky-footer');
      console.log("Login with correct credentials successful");
      done();
    });
  });

  it('is home page display correct statistics content', function(done) {
    this.driver.findElement(selenium.By.css("input.form-control:nth-child(2)")).sendKeys(user);
    this.driver.findElement(selenium.By.css("input.form-control:nth-child(1)")).sendKeys(password);
    this.driver.findElement(selenium.By.css(".btn")).click();
    var element = this.driver.wait(selenium.until.elementLocated(selenium.By.css("div.col:nth-child(1) > h2:nth-child(1)")), 10000);

    element.getText().then(function(text) {
      expect(text).toEqual('Statistics');
      console.log(text + ': header displayed success');
      done();
    });
  });

  it('is home page display correct flights by drones content', function(done) {
    this.driver.findElement(selenium.By.css("input.form-control:nth-child(2)")).sendKeys(user);
    this.driver.findElement(selenium.By.css("input.form-control:nth-child(1)")).sendKeys(password);
    this.driver.findElement(selenium.By.css(".btn")).click();
    var element = this.driver.wait(selenium.until.elementLocated(selenium.By.css("div.col:nth-child(2) > h2:nth-child(1)")), 10000);

    element.getText().then(function(text) {
      expect(text).toEqual('Flights by drones');
      console.log(text + ': header displayed success');
      done();
    });
  });

  it('is login page title correct', function(done) {
    this.driver.getTitle().then(function(title) {
      expect(title).toBe('Login to application');
      console.log(title + ": page title correct");
      done();
    });
  });
});
