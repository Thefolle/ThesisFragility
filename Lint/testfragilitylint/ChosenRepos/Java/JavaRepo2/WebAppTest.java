package AutomatedTests;

import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.firefox.FirefoxDriver;
//comment the above line and uncomment below line to use Chrome
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.By;
//import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.firefox.FirefoxDriver;
//import org.openqa.selenium.chrome.ChromeDriver;
//import org.openqa.selenium.remote.RemoteWebDriver;
//import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.Dimension;
//import org.openqa.selenium.WebElement;
//import org.openqa.selenium.interactions.Actions;
//import org.openqa.selenium.support.ui.ExpectedConditions;
//import org.openqa.selenium.support.ui.WebDriverWait;
//import org.openqa.selenium.JavascriptExecutor;
//import org.openqa.selenium.Alert;
//import org.openqa.selenium.Keys;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;

public class WebAppTest {
	private static WebDriver driver;
	private static Map<String, Object> vars;

  public static void main(String[] args) {
      // declaration and instantiation of objects/variables
  //	System.setProperty("webdriver.gecko.driver","C:\\geckodriver.exe");
	//	WebDriver driver = new FirefoxDriver();
		//comment the above 2 lines and uncomment below 2 lines to use Chrome
		System.setProperty("webdriver.chrome.driver","/Users/nagen/Downloads/chromedriver");
	    driver = new ChromeDriver();
  	
      String baseUrl = "http://localhost:8080/WebJava/";
     
      
      vars = new HashMap<String, Object>();
      // launch  and direct it to the Base URL
      driver.get(baseUrl);

      driver.manage().window().setSize(new Dimension(1280, 777));
      vars.put("window_handles", driver.getWindowHandles());
      driver.findElement(By.linkText("Add a new record")).click();
      vars.put("win2548", waitForWindow(2000));
      try {
      Thread.sleep(1000);
      }
      catch (Exception e1) { e1.printStackTrace();}
      driver.switchTo().window(vars.get("win2548").toString());
      driver.findElement(By.name("regn_num")).click();
      driver.findElement(By.name("regn_num")).sendKeys("BV 79 SAGV");
      driver.findElement(By.name("model")).click();
      driver.findElement(By.name("model")).sendKeys("Corvette");
      driver.findElement(By.name("color")).click();
      driver.findElement(By.name("color")).sendKeys("Silver");
      driver.findElement(By.name("mileage")).click();
      driver.findElement(By.name("mileage")).sendKeys("4309");
      driver.findElement(By.cssSelector("input:nth-child(15)")).click();
      //assertThat(driver.findElement(By.cssSelector("body")).getText(), is("Successfully Inserted"));
     
      //close Chrome
      driver.close();
     
  }
  
  public static String waitForWindow(int timeout) {
      try {
        Thread.sleep(timeout);
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
      Set<String> whNow = driver.getWindowHandles();
      Set<String> whThen = (Set<String>) vars.get("window_handles");
      if (whNow.size() > whThen.size()) {
        whNow.removeAll(whThen);
      }
      return whNow.iterator().next();
    } 

}
