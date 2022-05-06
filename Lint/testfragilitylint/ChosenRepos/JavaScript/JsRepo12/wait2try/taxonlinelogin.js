// @ts-nocheck
//title
//Client Portal

describe('tax online log in', function() {

    //var expect = chai.expect;
    //var jasminere = require('jasmine-reporters');

    var url ='http://qa5-clientportalweb.elasticbeanstalk.com/';


    var lName = element(by.id('Username'));
    var lpw = element(by.id('Password'));
    var loginBtn = element(by.css('button.btn.btn-login'));

    var submitBtn = element(by.id('submit'));

    var mytitle = 'Client Portal';



    //var history = element.all(by.repeater('result in memory'));



    function loginas(name, pw) {
        lName.sendKeys(name);
        lpw.sendKeys(pw);
        submitBtn.click();
    }

    beforeEach(function() {
        browser.get('http://qa5-clientportalweb.elasticbeanstalk.com/');
    },10000);


    /*

    it('should allow cynthia login', function(){

        loginBtn.click();
        loginas('cynthia.ji@myob.com','Myob1234');
        submitBtn.click();

    });
*/

    it('should have a title', function() {

        it('should allow cynthia login', function(){

            loginBtn.click();
            loginas('cynthia.ji@myob.com','Myob1234');
            submitBtn.click();

        },10000);


         expect(browser.getTitle()).toEqual(mytitle);


        //expect(history.count()).toEqual(2);

        //expect(browser.getTitle().to.eventually.equal(mytitle).and.notify(next);

        //expect(history.count()).toEqual(3); // This is wrong!
    },10000);
});

/*
 package com.example.tests;

 import com.thoughtworks.selenium.*;
 import org.junit.After;
 import org.junit.Before;
 import org.junit.Test;
 import static org.junit.Assert.*;
 import java.util.regex.Pattern;

 public class taxOnLineLoginQA5java {
 private Selenium selenium;

 @Before
 public void setUp() throws Exception {
 selenium = new DefaultSelenium("localhost", 4444, "*chrome", "http://qa5-clientportalweb.elasticbeanstalk.com/");
 selenium.start();
 }

 @Test
 public void testTaxOnLineLoginQA5java() throws Exception {
 selenium.open("/");
 selenium.click("id=errorTryAgain");
 selenium.waitForPageToLoad("30000");
 selenium.click("css=button.btn.btn-login");
 selenium.waitForPageToLoad("30000");
 selenium.click("LOCATOR_DETECTION_FAILED");
 selenium.type("id=Username", "cynthia.ji@myob.com");
 selenium.type("id=Password", "Myob1234");
 selenium.click("id=submit");
 selenium.waitForPageToLoad("30000");
 selenium.click("css=a.pull-left");
 selenium.click("link=Documents");
 selenium.click("link=Task Centre");
 selenium.click("link=Completed Tasks");
 selenium.click("link=Documents");
 selenium.click("link=Correspondence");
 selenium.click("link=Financial Planning");
 selenium.click("link=General");
 selenium.click("link=Tax and Accounting");
 selenium.click("css=span.user-name.ng-binding");
 selenium.click("link=Log Out");
 }

 @After
 public void tearDown() throws Exception {
 selenium.stop();
 }
 }

 */