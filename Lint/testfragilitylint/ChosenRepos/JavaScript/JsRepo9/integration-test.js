// @ts-nocheck
var selenium=require('selenium-webdriver');

describe('Selenium Tutorial', function(){

  beforeEach(function(done){
    this.driver=new selenium.Builder()
       .withCapabilities(selenium.Capabilities.chrome())
       .build();
    
    this.driver.get('http://www.techinsight.io/').then(done);
  });

  afterEach(function(done){
    this.driver.quit().then(done);

  });

  it('Should be on the home page', function(done){
    var element=this.driver.findElement(selenium.By.tagName('body'));

    element.getAttribute('id').then(function(id){
       expect(id).toBe('home');
       done();
    });
  });


  it('Has a working nav', function(done){
     var element=this.driver.findElement(selenium.By.linkText('REVEIW'));
     element.click();

     this.driver.getCurrentUrl().then(function(value){
        expect(value).toContain('/review');
        done();  
     });
  });

});
