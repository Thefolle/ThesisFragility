	package com.studytrade.studytrade2.testing.selenium;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium;

public class SendUsermessageTest {

	@Before
	public void setUp() throws Exception {
		// /NOP
	}

	/**
	 * Logs in
	 * 
	 * searches for article
	 * 
	 * goes to owner page
	 * 
	 * sends message
	 * 
	 * tests resulting page
	 */
	@Test
	public void testSendusermessage() throws Exception {
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

		//#####################

		selenium.click("selendebug_CmnPg_btn_search");
		selenium.waitForPageToLoad("10000");
		
		//#####################

		selenium.click("selendebug_serepg_pnl_result");
		selenium.waitForPageToLoad("10000");

		//#####################

		selenium.click("selendebug_artpg_btn_seller");
		selenium.waitForPageToLoad("10000");
		
		Assert.assertTrue(selenium.isTextPresent("serpage from"));

		//#####################
		
		selenium.type("selendebug_usrpg_ed_msgheader", "HEADER_SELENIUM");
		selenium.type("selendebug_usrpg_ed_msgtext", "MESSAGE_SELENIUM");
		selenium.click("selendebug_usrpg_btn_msgsend");
		selenium.waitForPageToLoad("10000");
		

		Assert.assertTrue(selenium.isTextPresent("Message to"));
		Assert.assertTrue(selenium.isTextPresent("send"));
		
		//#####################
		selenium.close();
		//#####################
	}
}
