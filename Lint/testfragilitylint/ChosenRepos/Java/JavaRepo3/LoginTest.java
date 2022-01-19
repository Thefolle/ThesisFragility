package com.studytrade.studytrade2.testing.selenium;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium;

public class LoginTest {

	@Before
	public void setUp() throws Exception {
		// /NOP
	}

	/**
	 * Tries to login the existing user 'Mikescher'
	 */
	@Test
	public void testLogin_1() throws Exception {
		WebDriver driver = new FirefoxDriver();

		WebDriverBackedSelenium selenium = new WebDriverBackedSelenium(driver, "http://localhost:8080/");

		selenium.open("StudyTrade2/");

		selenium.setTimeout("10000");

		selenium.waitForPageToLoad("10000");

		selenium.type("selendebug_CmnPg_ed_username", "Mikescher");
		selenium.type("selendebug_CmnPg_ed_passw", "test");

		selenium.click("selendebug_CmnPg_btn_login");

		selenium.waitForPageToLoad("10000");

		Assert.assertTrue(selenium.isTextPresent("Mikescher"));
		Assert.assertTrue(selenium.isTextPresent("Log Off"));
		
		selenium.close();
	}
	
	/**
	 * Tries to login the existing user 'MBiel'
	 */
	@Test
	public void testLogin_2() throws Exception {
		WebDriver driver = new FirefoxDriver();

		WebDriverBackedSelenium selenium = new WebDriverBackedSelenium(driver, "http://localhost:8080/");

		selenium.open("StudyTrade2/");

		selenium.setTimeout("10000");

		selenium.waitForPageToLoad("10000");

		selenium.type("selendebug_CmnPg_ed_username", "MBiel");
		selenium.type("selendebug_CmnPg_ed_passw", "foo");

		selenium.click("selendebug_CmnPg_btn_login");

		selenium.waitForPageToLoad("10000");

		Assert.assertTrue(selenium.isTextPresent("MBiel"));
		Assert.assertTrue(selenium.isTextPresent("Log Off"));
		
		selenium.close();
	}
	
	/**
	 * Tries to login the NON-existing user 'User_xxxxxx'
	 */
	@Test
	public void testLogin_3() throws Exception {
		WebDriver driver = new FirefoxDriver();

		WebDriverBackedSelenium selenium = new WebDriverBackedSelenium(driver, "http://localhost:8080/");

		selenium.open("StudyTrade2/");

		selenium.setTimeout("10000");

		selenium.waitForPageToLoad("10000");

		selenium.type("selendebug_CmnPg_ed_username", "User_xxxxx");
		selenium.type("selendebug_CmnPg_ed_passw", "test");

		selenium.click("selendebug_CmnPg_btn_login");

		selenium.waitForPageToLoad("10000");

		Assert.assertFalse(selenium.isTextPresent("User_xxxxx")); // NOT LOGGED IN
		
		

		//#####################
		selenium.close();
		//#####################
	}
}
