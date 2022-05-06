// @ts-nocheck



describe('tax online MYOB log in', function() {


    var url1 ='https://test.secure.myob.com/';
    var url2 ='http://qa5-clientportalweb.elasticbeanstalk.com/';
    var mywait =browser.driver.sleep(3000);




    var mytitle1 = 'MYOB Account - Sign in';
    var mytitle2 = 'Practice Online';
    var titile3 ='Client Portal';
    var logemail = 'test@mail.com';
    var logpw='pass';





    beforeEach(function() {
       // browser.driver.get("http://qa5-clientportalweb.elasticbeanstalk.com/login");
        browser.driver.manage().window().maximize();
        browser.driver.sleep(3000);




    it('should have a title - MYOB Account - Sign in', function() {
        browser.driver.get("http://qa5-clientportalweb.elasticbeanstalk.com/login");
        browser.driver.findElement(By.xpath('html/body/div[2]/div/div/div/div/div/div[1]/button[1]')).click();
        browser.driver.navigate(url1);
        browser.driver.sleep(3000);
        expect(browser.driver.getTitle()).toEqual('MYOB Account - Sign in');

    });

    it('should allow cynthia login', function(){


        //
        // https://test.secure.myob.com/oauth2/Account/Login?ReturnUrl=%2foauth2%2faccount%2fauthorize%3fresponse_type%3dcode%26redirect_uri%3dhttp%253A%252F%252Fqa5-clientportalweb.elasticbeanstalk.com%252Fauth%252Fmyob%252Fcallback%26scope%3dpractice.online%2520client.portal%2520mydot.contacts.read%2520AccountantsFramework%26client_id%3dClientPortal&response_type=code&redirect_uri=http%3A%2F%2Fqa5-clientportalweb.elasticbeanstalk.com%2Fauth%2Fmyob%2Fcallback&scope=practice.online%20client.portal%20mydot.contacts.read%20AccountantsFramework&client_id=ClientPortal
        browser.driver.sleep(3000);
        browser.driver.findElement(By.id("Username")).clear();
        browser.driver.findElement(By.id("Username")).sendKeys("test@mail.com");
        browser.driver.findElement(By.id("Password")).clear();
        browser.driver.findElement(By.id("Password")).sendKeys("pass");
        browser.driver.findElement(By.id("submit")).click();

        //expect(this.isTrue(true));

    });


    it('should have a title - Practice Online', function(){
        browser.driver.get(url2 );
        expect(browser.driver.getTitle()).toEqual('Client Portal');
        //'Client Portal'
        //'Practice Online'
        browser.driver.findElement(By.css("a.pull-left")).click();
        browser.driver.get(url2 + "/tasks");

        //String Client Portal = browser.driver.getTitle();

        browser.driver.findElement(By.css("i.fa.fa-bars")).click();

/*
            browser.findElement(By.linkText('Documents')).isElementPresent(),then(function(){
            browser.element(By.xpath('html/body/div[2]/div/header/ul[1]/li[1]/a')).click();
        });

*/




        browser.driver.findElement(By.linkText('Completed Tasks')).click();

/*
        browser.driver.findElement(By.linkText('Documents')).click();
        browser.driver.findElement(By.linkText('Task Centre')).click();
        browser.driver.findElement(By.linkText('Completed Tasks')).click();

        browser.driver.findElement(By.linkText('Correspondence')).click();
        browser.driver.findElement(By.linkText('Financial Planning')).click();
        browser.driver.findElement(By.linkText('General')).click();
        browser.driver.findElement(By.linkText('Tax and Accounting')).click();
*/
        browser.driver.findElement(By.css('span.user-name.ng-binding')).click();
        browser.driver.findElement(By.linkText('Log Out')).click();

        browser.driver.quit();




    });



});

/*
 online@OnlineTax-L1:~/test-pro-cu/test1217$ protractor protest/confcj.js
 Using the selenium server at http://localhost:4444/wd/hub
 [launcher] Running 1 instances of WebDriver
 ...

 Finished in 29.628 seconds
 3 tests, 2 assertions, 0 failures

 [launcher] 0 instance(s) of WebDriver still running
 [launcher] firefox #1 passed
 online@OnlineTax-L1:~/test-pro-cu/test1217$



 */
})