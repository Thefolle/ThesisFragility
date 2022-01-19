package com.example.selenium_uno;


import com.codeborne.selenide.Configuration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.util.HashMap;
import java.util.Map;

import static com.codeborne.selenide.Selenide.open;
import static com.codeborne.selenide.WebDriverRunner.getWebDriver;

public class SearchTest {
    private WebDriver driver;
    private Map<String, Object> vars;
    JavascriptExecutor js;
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
    public void googlecookies() {
        driver.get("https://www.google.com/");
        driver.manage().window().setSize(new Dimension(802, 816));
        driver.switchTo().frame(0);
        driver.findElement(By.cssSelector(".I47yTd")).click();
        driver.findElement(By.cssSelector("#introAgreeButton .RveJvd")).click();
        driver.switchTo().defaultContent();
        driver.findElement(By.name("q")).click();
        driver.findElement(By.name("q")).sendKeys("devops");
        driver.findElement(By.name("q")).sendKeys(Keys.ENTER);
    }
}