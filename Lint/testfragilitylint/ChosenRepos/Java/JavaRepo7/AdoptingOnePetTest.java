package com.bemach.aep.selenium.ide;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import com.thoughtworks.selenium.Selenium;
import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium;

/**
 * This code is generated using Selenium IDE
 * 
 * Make sure to run with the following settings:
 *  
 *  -Dwebdriver.chrome.driver=C:\dev\bin\misc\chromedriver.exe
 * 
 * @author ktran
 *
 */
public class AdoptingOnePetTest {
	private Selenium selenium;

	@Before
	public void setUp() throws Exception {
		WebDriver driver = new ChromeDriver();
		String baseUrl = "http://puppies.herokuapp.com/";
		selenium = new WebDriverBackedSelenium(driver, baseUrl);
	}

	@Test
	public void testAdopting_one_puppy() throws Exception {
		selenium.open("/");
		selenium.click("css=input.rounded_button");
		selenium.waitForPageToLoad("30000");
		selenium.click("css=input.rounded_button");
		selenium.waitForPageToLoad("30000");
		selenium.click("css=input.rounded_button");
		selenium.waitForPageToLoad("30000");
		selenium.type("id=order_name", "My");
		selenium.type("id=order_address", "My address");
		selenium.type("id=order_email", "a@b");
		selenium.select("id=order_pay_type", "label=Check");
		selenium.click("name=commit");
		selenium.waitForPageToLoad("30000");
	}

	@After
	public void tearDown() throws Exception {
//		selenium.stop();
		selenium.close();
	}
}
