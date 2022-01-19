package com.example.tests;

import com.thoughtworks.selenium.Selenium;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverBackedSelenium;
import org.openqa.selenium.firefox.FirefoxDriver;

import static org.junit.Assert.*;

public class NemesisAdminConsoleSeleniumIntegrationTest {
    private Selenium selenium;

    @Before
    public void setUp() throws Exception {
        WebDriver driver = new FirefoxDriver();
        String baseUrl = "http://localhost:8080/";
        selenium = new WebDriverBackedSelenium(driver, baseUrl);
    }

    @Test
    public void testNemesisAdminConsoleSeleniumIntegration() throws Exception {
        selenium.open("/admin/");
        selenium.waitForPageToLoad("5000");
        // Header link
        selenium.clickAt("id=app-header-title", "");
        selenium.waitForPageToLoad("5000");
        // System Properties
        assertEquals("4", selenium.getCssCount("css=div#system-properties-grid-body table.x-grid-item"));
        selenium.clickAt("css=input[id^='system-properties-filter-input']", "");
        selenium.sendKeys("css=input[id^='system-properties-filter-input']", "one");
        Thread.sleep(500);
        assertEquals("1", selenium.getCssCount("css=table.x-grid-item"));
        selenium.click("id=system-properties-filter-trigger-clear");
        assertEquals("4", selenium.getCssCount("css=table.x-grid-item"));
        selenium.clickAt("css=div#system-properties-grid-body table.x-grid-item td.x-grid-cell", "");
        selenium.click("css=span[id^='system-properties-delete-btn']");
        assertEquals("3", selenium.getCssCount("css=table.x-grid-item"));
        selenium.clickAt("css=span[id^='system-properties-save-btn']", "");
        assertEquals("3", selenium.getCssCount("css=table.x-grid-item"));
        // Log Levels
        selenium.clickAt("css=span.x-tab-inner-default:contains('Levels')", "");
        assertEquals("6", selenium.getCssCount("css=table.x-grid-item"));
        selenium.clickAt("css=span.x-tab-inner-default:contains('Levels')", "");
        assertEquals("3", selenium.getCssCount("css=div#system-loggers-grid-body table.x-grid-item"));
        selenium.clickAt("css=input[id^='system-loggers-filter-input']", "");
        selenium.sendKeys("css=input[id^='system-loggers-filter-input']", "one");
        Thread.sleep(500);
        assertEquals("1", selenium.getCssCount("css=div#system-loggers-grid-body table.x-grid-item"));
        selenium.click("id=system-loggers-filter-trigger-clear");
        selenium.clickAt("css=div#system-loggers-grid-body table.x-grid-item td.x-grid-cell", "");
        selenium.clickAt("id=system-loggers-delete-btn", "");
        assertEquals("2", selenium.getCssCount("css=div#system-loggers-grid-body table.x-grid-item"));
        // IDAnalyzer portlet.
        selenium.sendKeys("id=id-input-field-inputEl", "123456");
        selenium.clickAt("id=decode-id-button", "");
        Thread.sleep(500);
        assertEquals("100", selenium.getValue("id=id-input-field-inputEl"));
        // Thread dump
        selenium.clickAt("id=platform-actions-thread-dump", "");
        Thread.sleep(500);
        assertTrue(selenium.isElementPresent("id=threadDumpResultWindow"));
        assertEquals("thread dump", selenium.getValue("id=threaddumpResultArea-inputEl"));
        selenium.click("css=div#threadDumpResultWindow img.x-tool-close");
        Thread.sleep(500);
        assertFalse(selenium.isElementPresent("id=threadDumpResultWindow"));
        // Change locale
        selenium.runScript("var c = Ext.getCmp('app-header-language-selector'); c.setValue({'isoCode':'bg'}); c.fireEvent('select', c, {'isoCode':'bg'});");
        selenium.waitForPageToLoad("5000");
        assertEquals("Изход", selenium.getText("id=app-header-logout"));
        // Logout Link
        selenium.clickAt("id=app-header-logout", "");
        Thread.sleep(500);
        assertEquals("Login Page", selenium.getTitle());
    }

    @After
    public void tearDown() throws Exception {
        selenium.stop();
    }
}
