// @ts-nocheck


describe('tax online Google log in and Browsing', function() {


    var url0 = 'https://test.secure.myob.com/';
    var url1='http://qa5.addevcloudsites.myob.com';

    var url2 = 'http://qa5-clientportalweb.elasticbeanstalk.com/';

    var url3 = 'http://qa5.addevcloudsites.myob.com/clients';
    var redi = 'ReturnUrl=%2foauth2%2faccount%2fauthorize%3fresponse_type%3dcode%26redirect_uri%3dhttp%253A%252F%252Fqa5-clientportalweb.elasticbeanstalk.com%252Fauth%252Fmyob%252Fcallback%26scope%3dpractice.online%2520client.portal%2520mydot.contacts.read%2520AccountantsFramework%26client_id%3dClientPortal&response_type=code&redirect_uri=http%3A%2F%2Fqa5-clientportalweb.elasticbeanstalk.com%2Fauth%2Fmyob%2Fcallback&scope=practice.online%20client.portal%20mydot.contacts.read%20AccountantsFramework&client_id=ClientPortal';

    //http://qa5-clientportalweb.elasticbeanstalk.com/tasks
    var titile1 ='MYOB Account - Sign in';
    var title2 = 'Practice Online';
    var myemail='test@mail.com';





    it('should have a title - MYOB Account - Sign in', function () {

        browser.driver.manage().window().maximize();


        browser.driver.get(url1 + '/oauth2/Account/Login?ReturnUrl=%2foauth2%2faccount%2fauthorize%3fresponse_type%3dcode%26redirect_uri%3dhttp%253A%252F%252Fqa5.addevcloudsites.myob.com%252Fauth%252Fmyob%252Fcallback%26scope%3dpractice.online%2520client.portal%2520mydot.contacts.read%2520mydot.assets.read%2520Assets%2520la.global%2520CompanyFile%2520AccountantsFramework%26client_id%3dPracticeOnline&response_type=code&redirect_uri=http%3A%2F%2Fqa5.addevcloudsites.myob.com%2Fauth%2Fmyob%2Fcallback&scope=practice.online%20client.portal%20mydot.contacts.read%20mydot.assets.read%20Assets%20la.global%20CompanyFile%20AccountantsFramework&client_id=PracticeOnline');
        browser.driver.findElement(By.id('Username')).clear();
        browser.driver.findElement(By.id('Username')).sendKeys(myemail);
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
    it('Tax - Add FBT Return', function () {
        browser.by.linkText('Tax').click();
        browser.waitForAngular();
        browser.findElement(by.className('[class="icon-tax"]')).click();
        browser.findElement(by.className('[class="page-header-cta btn btn-success"]')).click();


        browser.click('[class="icon-tax"]'); // click on %Tax icon on the task b

    });



});

/*
 ar

 browser.click('[class="page-header-cta btn btn-success"]'); //Click on Add new form

 browser.getText('[class="page-header ng-scope"]', function(err, result) {
 console.log(result);
 assert(result === 'Add FBT Return');
 //Add FBT Return
 });

 online@OnlineTax-L1:~/test-pro-cu/test1217$ protractor protest/confcj.js
 Using the selenium server at http://localhost:4444/wd/hub
 [launcher] Running 1 instances of WebDriver
 ...

 Finished in 10.836 seconds
 3 tests, 3 assertions, 0 failures

 [launcher] 0 instance(s) of WebDriver still running
 [launcher] firefox #1 passed
 online@OnlineTax-L1:~/test-pro-cu/test1217$





 */