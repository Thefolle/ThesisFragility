package com.studytrade.studytrade2.testing.selenium;

import java.util.Random;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium;

public class RegisterTest {
	
	@Before
    public void setUp() throws Exception {
        ///NOP
    }
    
	/**
	 * Incrementally fills all needed Fields and every times asserts the expected error message
	 */
	@Test
    public void testRegister_All() throws Exception {
		WebDriver driver = new FirefoxDriver();

		WebDriverBackedSelenium selenium = new WebDriverBackedSelenium(driver, "http://localhost:8080/");

		selenium.open("StudyTrade2/");

		selenium.setTimeout("1000");
		selenium.waitForPageToLoad("1000");
		selenium.click("selendebug_CmnPg_btn_register");
		
		//###########################################################
		
		selenium.click("selendebug_RegPg_btn_register");
		selenium.waitForPageToLoad("1000");
		Assert.assertTrue(selenium.isTextPresent("Please insert a forename"));

		//###########################################################
		
		selenium.type("selendebug_RegPg_ed_forename", "sample_forename");
		
		selenium.click("selendebug_RegPg_btn_register");
		selenium.waitForPageToLoad("1000");
		Assert.assertTrue(selenium.isTextPresent("Please insert a lastname"));

		//###########################################################
		
		selenium.type("selendebug_RegPg_ed_lastname", "sample_lastname");
		
		selenium.click("selendebug_RegPg_btn_register");
		selenium.waitForPageToLoad("1000");
		Assert.assertTrue(selenium.isTextPresent("Please insert a nickname"));

		//###########################################################
		
		selenium.type("selendebug_RegPg_ed_nickname", "sample_nickname_" + new Random().nextInt());
		
		selenium.click("selendebug_RegPg_btn_register");
		selenium.waitForPageToLoad("1000");
		Assert.assertTrue(selenium.isTextPresent("Please insert a city"));

		//###########################################################
		
		selenium.type("selendebug_RegPg_ed_city", "sample_city");
		
		selenium.click("selendebug_RegPg_btn_register");
		selenium.waitForPageToLoad("1000");
		Assert.assertTrue(selenium.isTextPresent("Please choose a university"));

		//###########################################################
		
		Select selectObject = new Select(driver.findElement(By.id("selendebug_RegPg_cbx_university")).findElement(By.className("v-select-select")));
		selectObject.selectByIndex(1);
		
		selenium.click("selendebug_RegPg_btn_register");
		selenium.waitForPageToLoad("1000");
		Assert.assertTrue(selenium.isTextPresent("Please insert a study direction"));

		//###########################################################
		
		selenium.type("selendebug_RegPg_ed_direction", "sample_studydirection");
		
		selenium.click("selendebug_RegPg_btn_register");
		selenium.waitForPageToLoad("1000");
		Assert.assertTrue(selenium.isTextPresent("Please insert a E-Mail address"));

		//###########################################################
		
		selenium.type("selendebug_RegPg_ed_mail", "sample_mail@sample_host.tld");
		
		selenium.click("selendebug_RegPg_btn_register");
		selenium.waitForPageToLoad("1000");
		Assert.assertTrue(selenium.isTextPresent("Please insert a password with a minimum length of 8 characters"));

		//###########################################################
		
		selenium.type("selendebug_RegPg_ed_pw1", "sample_password");
		
		selenium.click("selendebug_RegPg_btn_register");
		selenium.waitForPageToLoad("1000");
		Assert.assertTrue(selenium.isTextPresent("Passwords do not match"));

		//###########################################################
		
		selenium.type("selendebug_RegPg_ed_pw2", "sample_password");
		
		selenium.click("selendebug_RegPg_btn_register");
		selenium.waitForPageToLoad("1000");

		//###########################################################
		
		Assert.assertTrue(selenium.isTextPresent("Register"));
		Assert.assertTrue(selenium.isTextPresent("Login"));
		

		//#####################
		selenium.close();
		//#####################
    }
}
