// @ts-nocheck


describe('google page test', function() {



    var url1 ='http://www.google.com';

    var url2 ='https://test.secure.myob.com/';
    var url3= 'http://qa5.addevcloudsites.myob.com/clients';
    var redi='ReturnUrl=%2foauth2%2faccount%2fauthorize%3fresponse_type%3dcode%26redirect_uri%3dhttp%253A%252F%252Fqa5-clientportalweb.elasticbeanstalk.com%252Fauth%252Fmyob%252Fcallback%26scope%3dpractice.online%2520client.portal%2520mydot.contacts.read%2520AccountantsFramework%26client_id%3dClientPortal&response_type=code&redirect_uri=http%3A%2F%2Fqa5-clientportalweb.elasticbeanstalk.com%2Fauth%2Fmyob%2Fcallback&scope=practice.online%20client.portal%20mydot.contacts.read%20AccountantsFramework&client_id=ClientPortal';

    //http://qa5-clientportalweb.elasticbeanstalk.com/tasks

/*
    var lName = browser.driver.findElement(by.id('Username'));
    var lpw = browser.driver.findElement((by.id('Password'));
    var loginBtn = browser.driver.findElement((by.css('button.btn.btn-login'));

    var submitBtn = browser.driver.findElement((by.id('submit'));
*/
    var mytitle = 'Google';
    var keyword ='selenium';







    it('should have a title', function() {
     browser.driver.get(url1);


     browser.driver.sleep(3000);
     browser.driver.findElement(by.name('q')).sendKeys(keyword);
     browser.driver.sleep(3000);

     browser.driver.findElement(by.name('q')).submit();
     browser.driver.sleep(3000);
     mytitle = browser.driver.getTitle().toString();
 expect(browser.driver.getTitle().toString()).toEqual(mytitle);
console.log(browser.driver.getTitle().toString());

         //expect(browser.driver.getTitle()).equal(mytitle);



     });
});

/*
 protractor protest/confcj.js
 Using the selenium server at http://localhost:4444/wd/hub
 [launcher] Running 1 instances of WebDriver
 F

 Failures:

 1) google page test should have a title
 Message:
 Error: Angular could not be found on the page http://www.google.com/ : retries looking for angular exceeded
 Stacktrace:
 Error: Angular could not be found on the page http://www.google.com/ : retries looking for angular exceeded
 ==== async task ====
 Protractor.get(http://www.google.com/) - test for angular
 at [object Object].<anonymous> (/home/online/test-pro-cu/test1217/protest/googlpagetest.js:35:17)
 ==== async task ====
 Asynchronous test function: it()
 Error
 at [object Object].<anonymous> (/home/online/test-pro-cu/test1217/protest/googlpagetest.js:34:5)
 at Object.<anonymous> (/home/online/test-pro-cu/test1217/protest/googlpagetest.js:6:1)

 Finished in 11.831 seconds
 1 test, 1 assertion, 1 failure

 [launcher] 0 instance(s) of WebDriver still running
 [launcher] firefox #1 failed 1 test(s)
 [launcher] overall: 1 failed spec(s)
 [launcher] Process exited with error code 1
 online@OnlineTax-L1:~/test-pro-cu/test1217$

 Using the selenium server at http://localhost:4444/wd/hub
 [launcher] Running 1 instances of WebDriver
 F

 Failures:

 1) google page test should have a title
 Message:
 Error: Angular could not be found on the page http://www.google.com/ : retries looking for angular exceeded
 Stacktrace:
 Error: Angular could not be found on the page http://www.google.com/ : retries looking for angular exceeded
 ==== async task ====
 Protractor.get(http://www.google.com/) - test for angular
 at [object Object].<anonymous> (/home/online/test-pro-cu/test1217/protest/googlpagetest.js:35:17)
 ==== async task ====
 Asynchronous test function: beforeEach()
 Error
 at [object Object].<anonymous> (/home/online/test-pro-cu/test1217/protest/googlpagetest.js:33:5)
 at Object.<anonymous> (/home/online/test-pro-cu/test1217/protest/googlpagetest.js:7:1)

 2) google page test should have a title
 Message:
 Error: Error while waiting for Protractor to sync with the page: {"message":"angular is not defined","stackTrace":[{"fileName":"https://www.google.com.au/?gfe_rd=cr&ei=IbiQVJCnLsuN8QfalIHQAw&gws_rd=ssl line 68 > Function:4","methodName":"anonymous/<","lineNumber":1},{"fileName":"https://www.google.com.au/?gfe_rd=cr&ei=IbiQVJCnLsuN8QfalIHQAw&gws_rd=ssl line 68 > Function:1","methodName":"anonymous","lineNumber":15},{"fileName":"https://www.google.com.au/?gfe_rd=cr&ei=IbiQVJCnLsuN8QfalIHQAw&gws_rd=ssl:68","methodName":"handleEvaluateEvent","lineNumber":20}]}
 Stacktrace:
 Error: Error while waiting for Protractor to sync with the page: {"message":"angular is not defined","stackTrace":[{"fileName":"https://www.google.com.au/?gfe_rd=cr&ei=IbiQVJCnLsuN8QfalIHQAw&gws_rd=ssl line 68 > Function:4","methodName":"anonymous/<","lineNumber":1},{"fileName":"https://www.google.com.au/?gfe_rd=cr&ei=IbiQVJCnLsuN8QfalIHQAw&gws_rd=ssl line 68 > Function:1","methodName":"anonymous","lineNumber":15},{"fileName":"https://www.google.com.au/?gfe_rd=cr&ei=IbiQVJCnLsuN8QfalIHQAw&gws_rd=ssl:68","methodName":"handleEvaluateEvent","lineNumber":20}]}
 at Error (<anonymous>)
 ==== async task ====
 Protractor.waitForAngular()
 at [object Object].<anonymous> (/home/online/test-pro-cu/test1217/protest/googlpagetest.js:55:31)
 ==== async task ====
 Asynchronous test function: it()
 Error
 at [object Object].<anonymous> (/home/online/test-pro-cu/test1217/protest/googlpagetest.js:52:5)
 at Object.<anonymous> (/home/online/test-pro-cu/test1217/protest/googlpagetest.js:7:1)

 Finished in 11.762 seconds
 1 test, 2 assertions, 2 failures

 [launcher] 0 instance(s) of WebDriver still running
 [launcher] firefox #1 failed 2 test(s)
 [launcher] overall: 2 failed spec(s)
 [launcher] Process exited with error code 1
 online@OnlineTax-L1:~/test-pro-cu/test1217$

 */