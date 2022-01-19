package com.example.selenium_uno;

import com.codeborne.selenide.Configuration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.HashMap;
import java.util.Map;

import static com.codeborne.selenide.Selenide.open;
import static com.codeborne.selenide.WebDriverRunner.getWebDriver;

public class RobotTest {
    private WebDriver driver;
    private Map<String, Object> vars;
    JavascriptExecutor js;

    @BeforeEach
    public void setUp() {
        Configuration.startMaximized = true;
        open("about:blank");
        driver = getWebDriver();
        //driver = new FirefoxDriver(options);
        js = (JavascriptExecutor) driver;
        vars = new HashMap<String, Object>();
    }

    @AfterEach
    public void tearDown() {
        driver.quit();
    }


    @Test
    public void robotTest() {
        float valor = 0, valorTotal = 0;
        // Test name: RobotTest
        // Step # | name | target | value
        // 1 | open | http://localhost:3000/#!/ |
        driver.get("http://localhost:3000/#!/");
        // 2 | setWindowSize | 892x847 |
        driver.manage().window().setSize(new Dimension(892, 847));
        WebElement result = new WebDriverWait(driver,10)
                .until(ExpectedConditions.elementToBeClickable(By.cssSelector(".ng-scope:nth-child(1) > td .input-group-append > .btn")));
        // 3 | click | css=.ng-scope:nth-child(1) > .ng-binding:nth-child(2) |
        valor = Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(1) > .ng-binding:nth-child(2)")).getText().substring(1));
        // 4 | click | css=.ng-scope:nth-child(1) > td .input-group-append > .btn |
        driver.findElement(By.cssSelector(".ng-scope:nth-child(1) > td .input-group-append > .btn")).click();
        valorTotal += valor;
        // 5 | click | css=.ng-scope:nth-child(2) > .ng-binding:nth-child(2) |
        valor = Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(2) > .ng-binding:nth-child(2)")).getText().substring(1));
        // 6 | click | css=.ng-scope:nth-child(2) > td .input-group-append > .btn |
        driver.findElement(By.cssSelector(".ng-scope:nth-child(2) > td .input-group-append > .btn")).click();
        valorTotal += valor;
        // 7 | click | css=.ng-scope:nth-child(3) > .ng-binding:nth-child(2) |
        valor = Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(3) > .ng-binding:nth-child(2)")).getText().substring(1));
        // 8 | click | css=.ng-scope:nth-child(3) .input-group-append > .btn |
        driver.findElement(By.cssSelector(".ng-scope:nth-child(3) .input-group-append > .btn")).click();
        valorTotal += valor;
        // 9 | click | css=tr:nth-child(4) > .ng-binding |
        valor = Float.parseFloat(driver.findElement(By.cssSelector("tr:nth-child(4) > .ng-binding")).getText().substring(1));
        System.out.println(valorTotal+" "+valor);
        assert (valor==valorTotal);

    }

    @Test
    public void robotOrderReviewTest() {
        float valorA, valorB, valorC;
        int cantA=0, cantB=0, cantC=0;
        // Test name: RobotTest
        // Step # | name | target | value
        // 1 | open | http://localhost:3000/#!/ |
        driver.get("http://localhost:3000/#!/");
        // 2 | setWindowSize | 892x847 |
        driver.manage().window().setSize(new Dimension(892, 847));
        WebElement result = new WebDriverWait(driver,10)
                .until(ExpectedConditions.elementToBeClickable(By.cssSelector(".ng-scope:nth-child(1) > td .input-group-append > .btn")));
        // 3 | click | css=.ng-scope:nth-child(1) > .ng-binding:nth-child(2) |
        valorA = Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(1) > .ng-binding:nth-child(2)")).getText().substring(1));
        // 4 | click | css=.ng-scope:nth-child(1) > td .input-group-append > .btn |
        driver.findElement(By.cssSelector(".ng-scope:nth-child(1) > td .input-group-append > .btn")).click();
        cantA++;
        driver.findElement(By.cssSelector(".ng-scope:nth-child(1) > td .input-group-append > .btn")).click();
        cantA++;
        // 5 | click | css=.ng-scope:nth-child(2) > .ng-binding:nth-child(2) |
        valorB = Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(2) > .ng-binding:nth-child(2)")).getText().substring(1));
        // 6 | click | css=.ng-scope:nth-child(2) > td .input-group-append > .btn |
        driver.findElement(By.cssSelector(".ng-scope:nth-child(2) > td .input-group-append > .btn")).click();
        cantB++;
        // 7 | click | css=.ng-scope:nth-child(3) > .ng-binding:nth-child(2) |
        valorC = Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(3) > .ng-binding:nth-child(2)")).getText().substring(1));

        // 8 | click | css=.ng-scope:nth-child(3) .input-group-append > .btn |
        driver.findElement(By.cssSelector(".ng-scope:nth-child(3) .input-group-append > .btn")).click();
        cantC++;
        driver.findElement(By.cssSelector(".ng-scope:nth-child(3) .input-group-append > .btn")).click();
        cantC++;
        driver.findElement(By.cssSelector(".ng-scope:nth-child(3) .input-group-append > .btn")).click();
        cantC++;

        driver.findElement(By.cssSelector(".btn-success")).click();
        result = new WebDriverWait(driver,10)
                .until(ExpectedConditions.elementToBeClickable(By.id("ageInput")));
        assert (valorA==Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(1) > .ng-binding:nth-child(3)")).getText().substring(1)));
        assert (valorB==Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(2) > .ng-binding:nth-child(3)")).getText().substring(1)));
        assert (valorC==Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(3) > .ng-binding:nth-child(3)")).getText().substring(1)));

        assert (cantA==Integer.parseInt(driver.findElement(By.cssSelector(".ng-scope:nth-child(1) > .ng-binding:nth-child(2)")).getText()));
        assert (cantB==Integer.parseInt(driver.findElement(By.cssSelector(".ng-scope:nth-child(2) > .ng-binding:nth-child(2)")).getText()));
        assert (cantC==Integer.parseInt(driver.findElement(By.cssSelector(".ng-scope:nth-child(3) > .ng-binding:nth-child(2)")).getText()));

        assert (valorA*cantA==Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(1) > .ng-binding:nth-child(4)")).getText().substring(1)));
        assert (valorB*cantB==Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(2) > .ng-binding:nth-child(4)")).getText().substring(1)));
        assert (valorC*cantC==Float.parseFloat(driver.findElement(By.cssSelector(".ng-scope:nth-child(3) > .ng-binding:nth-child(4)")).getText().substring(1)));
    }

    @Test
    public void robotAgeTest() {
        Integer edad;
        // Test name: RobotAgeTest
        // Step # | name | target | value
        // 1 | open | http://localhost:3000/#!/ |
        driver.get("http://localhost:3000/#!/");
        // 2 | setWindowSize | 892x848 |
        driver.manage().window().setSize(new Dimension(892, 848));
        WebElement result = new WebDriverWait(driver,10)
                .until(ExpectedConditions.elementToBeClickable(By.cssSelector(".ng-scope:nth-child(1) > td .input-group-append > .btn")));

        // 3 | click | css=.ng-scope:nth-child(1) > td .input-group-append > .btn |
        driver.findElement(By.cssSelector(".ng-scope:nth-child(1) > td .input-group-append > .btn")).click();
        // 4 | click | css=.ng-scope:nth-child(1) > td .input-group-append > .btn |
        driver.findElement(By.cssSelector(".ng-scope:nth-child(1) > td .input-group-append > .btn")).click();
        // 5 | click | css=.ng-scope:nth-child(2) > td .input-group-append > .btn |
        driver.findElement(By.cssSelector(".ng-scope:nth-child(2) > td .input-group-append > .btn")).click();
        // 6 | click | css=.ng-scope:nth-child(3) .input-group-append > .btn |
        driver.findElement(By.cssSelector(".ng-scope:nth-child(3) .input-group-append > .btn")).click();
        // 7 | click | css=.btn-success |
        driver.findElement(By.cssSelector(".btn-success")).click();
        result = new WebDriverWait(driver,10)
                .until(ExpectedConditions.elementToBeClickable(By.id("ageInput")));

        // 8 | click | id=ageInput |
        driver.findElement(By.id("ageInput")).click();
        edad=2;
        // 9 | type | id=ageInput | 2
        driver.findElement(By.id("ageInput")).sendKeys(edad.toString());
        // 10 | click | css=.btn-success |
        driver.findElement(By.cssSelector(".btn-success")).click();
        if (edad<21){
            assert (driver.findElement(By.cssSelector(".alert-danger")).isDisplayed());
        }else {
            assert (driver.findElement(By.xpath("//robo-success")).isDisplayed());
        }
        // 11 | click | id=ageInput |
        driver.findElement(By.id("ageInput")).click();
        edad=21;
        // 12 | type | id=ageInput | 21
        driver.findElement(By.id("ageInput")).sendKeys(edad.toString());
        // 13 | click | css=.btn-success |
        driver.findElement(By.cssSelector(".btn-success")).click();
        if (edad<21){
            assert (driver.findElement(By.cssSelector(".alert-danger")).isDisplayed());
        }else {
            assert (driver.findElement(By.xpath("//robo-success")).isDisplayed());
        }

    }



}