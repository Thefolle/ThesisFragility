// @ts-nocheck


describe('tax online Google log in and Browsing', function() {


    var url1 = 'https://test.secure.myob.com/';

    var url2 = 'http://qa5-clientportalweb.elasticbeanstalk.com/';

    var url3 = 'http://qa5.addevcloudsites.myob.com/clients';
    var redi = 'ReturnUrl=%2foauth2%2faccount%2fauthorize%3fresponse_type%3dcode%26redirect_uri%3dhttp%253A%252F%252Fqa5-clientportalweb.elasticbeanstalk.com%252Fauth%252Fmyob%252Fcallback%26scope%3dpractice.online%2520client.portal%2520mydot.contacts.read%2520AccountantsFramework%26client_id%3dClientPortal&response_type=code&redirect_uri=http%3A%2F%2Fqa5-clientportalweb.elasticbeanstalk.com%2Fauth%2Fmyob%2Fcallback&scope=practice.online%20client.portal%20mydot.contacts.read%20AccountantsFramework&client_id=ClientPortal';

    //http://qa5-clientportalweb.elasticbeanstalk.com/tasks
    var titile1 ='MYOB Account - Sign in';
    var title2 = 'Practice Online';





    it('should have a title - MYOB Account - Sign in', function () {

        browser.driver.manage().window().maximize();


        browser.driver.get(url1 + '/oauth2/Account/Login?ReturnUrl=%2foauth2%2faccount%2fauthorize%3fresponse_type%3dcode%26redirect_uri%3dhttp%253A%252F%252Fqa5.addevcloudsites.myob.com%252Fauth%252Fmyob%252Fcallback%26scope%3dpractice.online%2520client.portal%2520mydot.contacts.read%2520mydot.assets.read%2520Assets%2520la.global%2520CompanyFile%2520AccountantsFramework%26client_id%3dPracticeOnline&response_type=code&redirect_uri=http%3A%2F%2Fqa5.addevcloudsites.myob.com%2Fauth%2Fmyob%2Fcallback&scope=practice.online%20client.portal%20mydot.contacts.read%20mydot.assets.read%20Assets%20la.global%20CompanyFile%20AccountantsFramework&client_id=PracticeOnline');
        browser.driver.findElement(By.id('Username')).clear();
        browser.driver.findElement(By.id('Username')).sendKeys('test@mail.com');
        browser.driver.findElement(By.id('Password')).clear();
        browser.driver.findElement(By.id('Password')).sendKeys('pass');
        //String MYOB Account - Sign in = browser.driver.getTitle();



        browser.driver.sleep(3000);
        expect(browser.driver.getTitle()).toEqual(titile1);
        //'MYOB Account - Sign in'




    });

    it('should have a text - Remember me', function () {
     expect(browser.driver.findElement(By.css('label.checkbox')).getText()).toEqual('Remember me');
     //Remember me

     //browser.driver.findElement(By.id('submit')).click();

     });

   it('should have a title - Practice Online', function () {

    browser.driver.findElement(By.id('submit')).click();
    expect(browser.driver.getTitle()).toEqual(title2);

    //'Practice Online'

   });


});

/*

 online@OnlineTax-L1:~/test-pro-cu/test1217$ protractor protest/confcj.js
 Using the selenium server at http://localhost:4444/wd/hub
 [launcher] Running 1 instances of WebDriver
 ...

 Finished in 10.836 seconds
 3 tests, 3 assertions, 0 failures

 [launcher] 0 instance(s) of WebDriver still running
 [launcher] firefox #1 passed
 online@OnlineTax-L1:~/test-pro-cu/test1217$



 it('should have a button - submit', function () {
 expect(browser.driver.findElement(By.id("submit")).getText()).toEqual('Sign in');
 //'submit'
 browser.driver.findElement(By.id('submit')).click();
 });


 it('should be able to browser around - Practice Online', function () {

 expect(browser.driver.getTitle()).toEqual('MYOB Account - Sign in');
 //'Practice Online'

 browser.driver.findElement(By.css('li.active > a')).click();
 browser.driver.findElement(By.linkText('Portals')).click();
 browser.driver.findElement(By.linkText('Create Portal')).click();
 browser.driver.findElement(By.xpath("//img[@alt='User Name']")).click();

 });


 it('should have a title - Create a Portal', function () {

 expect(browser.driver.findElement(By.css('h2').getText())).toEqual('Create a Portal');
 });
 it('should be able to log out', function () {
 browser.driver.findElement(By.xpath("//img[@alt='User Name']")).click();
 browser.driver.findElement(By.linkText('Log Out')).click();

 });

 @Before
 public void setUp() throws Exception {
 driver = new FirefoxDriver();
 baseUrl = 'https://test.secure.myob.com/';
 browser.driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
 }

 @Test
 public void testTaxOnLineLoginGoogle() throws Exception {
 browser.driver.get(baseUrl + '/oauth2/Account/Login?ReturnUrl=%2foauth2%2faccount%2fauthorize%3fresponse_type%3dcode%26redirect_uri%3dhttp%253A%252F%252Fqa5.addevcloudsites.myob.com%252Fauth%252Fmyob%252Fcallback%26scope%3dpractice.online%2520client.portal%2520mydot.contacts.read%2520mydot.assets.read%2520Assets%2520la.global%2520CompanyFile%2520AccountantsFramework%26client_id%3dPracticeOnline&response_type=code&redirect_uri=http%3A%2F%2Fqa5.addevcloudsites.myob.com%2Fauth%2Fmyob%2Fcallback&scope=practice.online%20client.portal%20mydot.contacts.read%20mydot.assets.read%20Assets%20la.global%20CompanyFile%20AccountantsFramework&client_id=PracticeOnline');
 browser.driver.findElement(By.id('Username')).clear();
 browser.driver.findElement(By.id('Username')).sendKeys('test@mail.com');
 browser.driver.findElement(By.id('Password')).clear();
 browser.driver.findElement(By.id('Password')).sendKeys('pass');
 String MYOB Account - Sign in = browser.driver.getTitle();
 for (int second = 0;; second++) {
 if (second >= 60) fail('timeout');
 try { if ('MYOB Account - Sign in'.equals(browser.driver.getTitle())) break; } catch (Exception e) {}
 Thread.sleep(1000);
 }

 for (int second = 0;; second++) {
 if (second >= 60) fail('timeout');
 try { if ('Remember me'.equals(browser.driver.findElement(By.cssSelector('label.checkbox')).getText())) break; } catch (Exception e) {}
 Thread.sleep(1000);
 }

 browser.driver.findElement(By.id('submit')).click();
 for (int second = 0;; second++) {
 if (second >= 60) fail('timeout');
 try { if ('Practice Online'.equals(browser.driver.getTitle())) break; } catch (Exception e) {}
 Thread.sleep(1000);
 }

 browser.driver.findElement(By.cssSelector('li.active > a')).click();
 browser.driver.findElement(By.linkText('Portals')).click();
 browser.driver.findElement(By.linkText('Create Portal')).click();
 browser.driver.findElement(By.xpath('//img[@alt='User Name']')).click();
 for (int second = 0;; second++) {
 if (second >= 60) fail('timeout');
 try { if ('Create a Portal'.equals(browser.driver.findElement(By.cssSelector('h2')).getText())) break; } catch (Exception e) {}
 Thread.sleep(1000);
 }

 browser.driver.findElement(By.xpath('//img[@alt='User Name']')).click();
 browser.driver.findElement(By.linkText('Log Out')).click();
 }

 @After
 public void tearDown() throws Exception {
 browser.driver.quit();
 String verificationErrorString = verificationErrors.toString();
 if (!''.equals(verificationErrorString)) {
 fail(verificationErrorString);
 }
 }

 private boolean isElementPresent(By by) {
 try {
 browser.driver.findElement(by);
 return true;
 } catch (NoSuchElementException e) {
 return false;
 }
 }

 private boolean isAlertPresent() {
 try {
 browser.driver.switchTo().alert();
 return true;
 } catch (NoAlertPresentException e) {
 return false;
 }
 }

 private String closeAlertAndGetItsText() {
 try {
 Alert alert = browser.driver.switchTo().alert();
 String alertText = alert.getText();
 if (acceptNextAlert) {
 alert.accept();
 } else {
 alert.dismiss();
 }
 return alertText;
 } finally {
 acceptNextAlert = true;
 }
 }
 }



error
 online@OnlineTax-L1:~/test-pro-cu/test1217$ protractor protest/confcj.js
 Using the selenium server at http://localhost:4444/wd/hub
 [launcher] Running 1 instances of WebDriver
 A Jasmine spec timed out. Resetting the WebDriver Control Flow.
 The last active task was:
 WebDriver.sleep(30000)
 at [object Object].webdriver.promise.ControlFlow.timeout (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/webdriver/promise.js:1370:15)
 at [object Object].webdriver.WebDriver.sleep (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/webdriver/webdriver.js:662:21)
 at [object Object].<anonymous> (/home/online/test-pro-cu/test1217/protest/taxonlinelogingoogle3.js:33:24)
 at /usr/local/lib/node_modules/protractor/node_modules/jasminewd/index.js:94:14
 at [object Object].webdriver.promise.ControlFlow.runInNewFrame_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/webdriver/promise.js:1654:20)
 at [object Object].webdriver.promise.ControlFlow.runEventLoop_ (/usr/local/lib/node_modules/protractor/node_modules/selenium-webdriver/lib/webdriver/promise.js:1518:8)
 at [object Object].wrapper [as _onTimeout] (timers.js:252:14)
 at Timer.listOnTimeout [as ontimeout] (timers.js:110:15)
 F

 Failures:

 1) tax online Google log in should have a title - MYOB Account - Sign in
 Message:
 timeout: timed out after 30000 msec waiting for spec to complete
 Stacktrace:
 undefined

 Finished in 35.087 seconds
 1 test, 1 assertion, 1 failure

 [launcher] 0 instance(s) of WebDriver still running
 [launcher] firefox #1 failed 1 test(s)
 [launcher] overall: 1 failed spec(s)
 [launcher] Process exited with error code 1
 online@OnlineTax-L1:~/test-pro-cu/test1217$

 */