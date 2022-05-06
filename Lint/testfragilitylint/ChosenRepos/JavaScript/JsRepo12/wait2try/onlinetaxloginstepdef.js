// @ts-nocheck
/**
 * Created by online on 16/12/14.
 */




describe('tax online log in try', function() {
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

var myrul ='';
var lname='test@mail.com';
var lpw='pass';
var mytitle='Client Portal';

 this.Given(/^I am on the login page 'http:\/\/qa(\d+)\-clientportalweb\.elasticbeanstalk\.com\/'$/, function(myurl, next) {
       // express the regexp above with the code you wish you had
       //callback.pending();
     browser.get(myurl);
     element(by.css('button.btn.btn-login')).click();
     next();
     });

 this.Then(/^I type mylogin username 'cynthia\.ji@myob\.com' and password 'Myob(\d+)'$/, function(lname,lpw, next) {
       // express the regexp above with the code you wish you had
       //callback.pending();
     element(by.id('Username')).clear();
     element(by.id('Username')).sendKeys(lname);

     element(By.id("Password")).clear();
     element(By.id("Password")).sendKeys("pass");
     element(By.id("submit")).click();


     });

 this.Then(/^click login and verify page title 'Client Portal'$/, function(mytitle, next) {
       // express the regexp above with the code you wish you had
       //callback.pending();

     expect(browser.getTitle()).toEqual(mytitle);
     });


});
/*
 browser.get('http://juliemr.github.io/protractor-demo/');
 element(by.model('first')).sendKeys(1);
 element(by.model('second')).sendKeys(2);

 element(by.id('gobutton')).click();

 expect(element(by.binding('latest')).getText()).
 toEqual('5'); // This is wrong!


 driver.get(baseUrl + "/");
 driver.findElement(By.id("errorTryAgain")).click();


 driver.findElement(By.cssSelector("button.btn.btn-login")).click();
 // ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]
 driver.findElement(By.id("Username")).clear();
 driver.findElement(By.id("Username")).sendKeys("test@mail.com");
 driver.findElement(By.id("Password")).clear();
 driver.findElement(By.id("Password")).sendKeys("pass");
 driver.findElement(By.id("submit")).click();
 driver.findElement(By.cssSelector("a.pull-left")).click();
 driver.findElement(By.linkText("Documents")).click();
 driver.findElement(By.linkText("Task Centre")).click();
 driver.findElement(By.linkText("Completed Tasks")).click();
 driver.findElement(By.linkText("Documents")).click();
 driver.findElement(By.linkText("Correspondence")).click();
 driver.findElement(By.linkText("Financial Planning")).click();
 driver.findElement(By.linkText("General")).click();
 driver.findElement(By.linkText("Tax and Accounting")).click();
 driver.findElement(By.cssSelector("span.user-name.ng-binding")).click();
 driver.findElement(By.linkText("Log Out")).click();
 }

 @After
 public void tearDown() throws Exception {
 selenium.stop();
 }
 }
*/
