package AutomatedTests;

import java.util.HashMap;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
//import org.testng.annotations.AfterMethod;
//import org.testng.annotations.BeforeMethod;
//import org.testng.annotations.Test;
public class ExpectedConditionExample {
// created reference variable for WebDriver
static WebDriver driver;


public static void main(String args[]) {

	System.setProperty("webdriver.chrome.driver","/Users/nagen/Downloads/chromedriver");
    driver = new ChromeDriver();
	
    String baseUrl = "https://gmail.com";
   
    
    //vars = new HashMap<String, Object>();
    // launch  and direct it to the Base URL
    driver.get(baseUrl);
	try {

    // launching gmail.com on the browser
		//driver.get("https://accounts.google.com/signin/v2/identifier?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin");
		driver.get("https://mail.yahoo.com/");
		// maximized the browser window
    driver.manage().window().maximize();
    driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);

	// saving the GUI element reference into a "element" variable of WebElement type
   // driver.findElement(By.linkText("Sign in")).click();
    
    
   // driver.manage().window().setSize(new Dimension(550, 691));
    driver.findElement(By.cssSelector(".fuji-button-text > span")).click();
    driver.findElement(By.id("login-username")).click();
    driver.findElement(By.id("login-username")).sendKeys("simplilearn");
    driver.findElement(By.cssSelector("label:nth-child(2)")).click();
    driver.findElement(By.id("login-signin")).click();
    driver.findElement(By.id("login-passwd")).click();
    driver.findElement(By.id("login-passwd")).sendKeys("password");
    driver.findElement(By.id("login-signin")).click();
  //  driver.findElement(By.linkText("Remind me later")).click();
    WebDriverWait wait = new WebDriverWait(driver,3000);
	wait.until(ExpectedConditions.visibilityOfElementLocated(By.linkText("Compose")));
    driver.findElement(By.linkText("Compose")).click();
    //driver.findElement(By.cssSelector("html")).click();
  
    /*
    driver.findElement(By.id("identifierId")).click();
    driver.findElement(By.id("identifierId")).sendKeys("xxxx");
    driver.findElement(By.cssSelector(".VfPpkd-RLmnJb")).click();
    driver.findElement(By.name("password")).sendKeys("xxxx");
    driver.findElement(By.cssSelector(".VfPpkd-LgbsSe-OWXEXe-k8QpJ > .VfPpkd-RLmnJb")).click();
    WebDriverWait wait = new WebDriverWait(driver,30);
	wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(text(),'COMPOSE')]")));
	driver.findElement(By.xpath("//div[contains(text(),'COMPOSE')]")).click(); */
    /*{
      WebElement element = driver.findElement(By.cssSelector(".VfPpkd-LgbsSe-OWXEXe-k8QpJ > .VfPpkd-RLmnJb"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    {
      WebElement element = driver.findElement(By.tagName("body"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element, 0, 0).perform();
    }
    driver.findElement(By.cssSelector(".T-I-KE")).click();
    {
      WebElement element = driver.findElement(By.linkText("Spam"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    } */
    
    
	
	
	}
	catch (Exception e1) {
		e1.printStackTrace();
	}
	driver.quit();
	
	}

	
	
	}
