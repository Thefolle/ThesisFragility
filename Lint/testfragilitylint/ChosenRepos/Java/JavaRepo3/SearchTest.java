package com.studytrade.studytrade2.testing.selenium;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium;

public class SearchTest {

	@Before
	public void setUp() throws Exception {
		// /NOP
	}

	/**
	 * Searches for tests and asserts one result with description = 'hello world'
	 * 
	 * Searches for 'Random string' and asserts no results (=> no 'ID:')
	 */
	@Test
	public void testSearch_Normal() throws Exception {
		WebDriver driver = new FirefoxDriver();

		WebDriverBackedSelenium selenium = new WebDriverBackedSelenium(driver, "http://localhost:8080/");

		selenium.open("StudyTrade2/");

		selenium.setTimeout("10000");
		selenium.waitForPageToLoad("10000");

		selenium.type("selendebug_CmnPg_ed_search", "test");
		selenium.click("selendebug_CmnPg_btn_search");
		selenium.waitForPageToLoad("10000");
		
		Assert.assertTrue(selenium.isTextPresent("hello world"));

		selenium.type("selendebug_CmnPg_ed_search", "lasdjklaksdjlaskdjlaksjd"); // UNFINDABLE
		selenium.click("selendebug_CmnPg_btn_search");
		selenium.waitForPageToLoad("10000");
		
		Assert.assertFalse(selenium.isTextPresent("ID:"));
		
		//#####################
		selenium.close();
		//#####################
	}
	
	/**
	 * Searches for Articles in the Advanced Dialog
	 */
	@Test
	public void testSearch_Advanced() throws Exception {
		WebDriver driver = new FirefoxDriver();

		WebDriverBackedSelenium selenium = new WebDriverBackedSelenium(driver, "http://localhost:8080/");

		selenium.open("StudyTrade2/");

		selenium.setTimeout("10000");
		selenium.waitForPageToLoad("10000");

		//#####################
		
		selenium.click("selendebug_CmnPg_btn_advsearch");
		selenium.waitForPageToLoad("10000");

		selenium.type("selendebug_AdvSrPg_ed_direction", "BWL"); // Study Driection BWL --> Seller 4 --> Article 3 (SwimmingPool)
		selenium.click("selendebug_AdvSrPg_btn_advsearch");
		selenium.waitForPageToLoad("10000");
		
		Assert.assertTrue(selenium.isTextPresent("SwimmingPool"));
		
		//#####################
		
		selenium.click("selendebug_CmnPg_btn_advsearch");
		selenium.waitForPageToLoad("10000");

		selenium.type("selendebug_AdvSrPg_ed_minprice", "100");
		selenium.type("selendebug_AdvSrPg_ed_maxprice", "150");
		selenium.click("selendebug_AdvSrPg_btn_advsearch");
		selenium.waitForPageToLoad("10000");
		
		Assert.assertTrue(selenium.isTextPresent("hello world")); //testdata[1].description = hello world
		
		//#####################
		selenium.close();
		//#####################
	}
}
