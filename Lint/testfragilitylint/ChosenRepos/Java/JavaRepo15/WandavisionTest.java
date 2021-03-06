package com.example.selenium_uno;// Generated by Selenium IDE

import static com.codeborne.selenide.Selenide.open;
import static com.codeborne.selenide.WebDriverRunner.getWebDriver;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.core.IsNot.not;

import com.codeborne.selenide.Configuration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Alert;
import org.openqa.selenium.Keys;
import java.util.*;
import java.net.MalformedURLException;
import java.net.URL;


public class WandavisionTest {
  private WebDriver driver;
  private Map<String, Object> vars;
  JavascriptExecutor js;
  ExpectedCondition<Boolean> expectation = new
          ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver driver) {
              return ((JavascriptExecutor) driver).executeScript("return document.readyState").toString().equals("complete");
            }
          };
  @BeforeEach
  public void setUp() {
    Configuration.startMaximized = true;
    open("about:blank");
    driver = getWebDriver();
    js = (JavascriptExecutor) driver;
    vars = new HashMap<String, Object>();
  }
  @AfterEach
  public void tearDown() {
    driver.quit();
  }
  @Test
  public void wandavision() {
    // Test name: wandavision
    // Step # | name | target | value
    // 1 | open | https://www.imdb.com/ |
    driver.get("https://www.imdb.com/");
    // 2 | setWindowSize | 802x817 |
    driver.manage().window().setSize(new Dimension(802, 817));
    WebDriverWait wait = new WebDriverWait(driver, 30);
    wait.until(expectation);
    // 3 | click | id=suggestion-search |
    driver.findElement(By.id("suggestion-search")).click();
    // 4 | type | id=suggestion-search | wandavision
    driver.findElement(By.id("suggestion-search")).sendKeys("wandavision");
    // 5 | sendKeys | id=suggestion-search | ${KEY_ENTER}
    driver.findElement(By.id("suggestion-search")).sendKeys(Keys.ENTER);
    WebElement wandaresult = new WebDriverWait(driver,10)
            .until(ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(text(),\'WandaVision\')]")));

    // 6 | click | css=.article |
    driver.findElement(By.cssSelector(".article")).click();
    // 7 | click | css=.article |
    driver.findElement(By.cssSelector(".article")).click();
    // 8 | click | linkText=WandaVision |
    driver.findElement(By.linkText("WandaVision")).click();
    // 9 | click | linkText=TRIVIA |
    driver.findElement(By.linkText("TRIVIA")).click();
  }
}
