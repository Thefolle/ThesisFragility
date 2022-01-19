package com.studytrade.studytrade2.testing.selenium;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium;

public class AddArticleTest {

	@Before
	public void setUp() throws Exception {
		// /NOP
	}

	/**
	 * Logs in
	 * 
	 * adds a new article (tests input validation before)
	 * 
	 * test the resulting page
	 */
	@Test
	public void testAddArticle() throws Exception {
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
		
		selenium.click("selendebug_CmnPg_btn_addarticle");
		selenium.waitForPageToLoad("10000");
		
		//#####################
		
		selenium.type("selendebug_addartg_ed_name", "TestArticle");
		selenium.type("selendebug_addartg_ed_price", "--NONINT--");
		Select selectObject = new Select(driver.findElement(By.id("selendebug_addartg_cbx_condition")).findElement(By.className("v-select-select")));
		selectObject.selectByIndex(1);
		Select selectObject2 = new Select(driver.findElement(By.id("selendebug_addartg_ed_place")).findElement(By.className("v-select-select")));
		selectObject2.selectByIndex(1);
		selenium.type("selendebug_addartg_ed_desc", "This is a automatic generated selenium test");
		
		selenium.click("selendebug_addartg_btn_send");
		selenium.waitForPageToLoad("10000");
		Assert.assertTrue(selenium.isTextPresent("Could not parse price"));	

		selenium.type("selendebug_addartg_ed_price", "99");
		selenium.click("selendebug_addartg_btn_send");
		selenium.waitForPageToLoad("10000");
		Assert.assertTrue(selenium.isTextPresent("You have succesfully added a article"));
		
		selenium.click("selendebug_showmsgpg_btn_ok");
		selenium.waitForPageToLoad("10000");
		
		Assert.assertTrue(selenium.isTextPresent("TestArticle"));
		Assert.assertTrue(selenium.isTextPresent("99"));
		Assert.assertTrue(selenium.isTextPresent("This is a automatic generated selenium test"));
		
		//#####################
		selenium.close();
		//#####################
	}
}
