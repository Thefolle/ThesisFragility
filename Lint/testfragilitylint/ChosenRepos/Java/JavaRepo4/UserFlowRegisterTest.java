package uitest;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.WebDriver.Navigation;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class UserFlowRegisterTest {
		private WebDriver driver;
		private Navigation navigation;
		private String baseUrl = "http://localhost:8080/Web_Application/logon.jsp";
		//http://68d56a5d.ngrok.io/Web_Application/

		@Before
		public void setUp() {
			//设置Chrome浏览器的位置
			System.setProperty("webdriver.chrome.driver", "/Users/fangfanghu/Documents/All/Tech/Selenium_Practice/chromedriver");
					
			//创建WebDriver对象
			ChromeOptions options = new ChromeOptions();
			options.addArguments("--no-sandbox");	
			options.addArguments("--disable-gpu");
			options.addArguments("headless");
			driver = new ChromeDriver(options);
			driver.manage().window().setSize(new Dimension(1280,800));
			navigation = driver.navigate();
		}

		@After
		public void tearDown() {
			if(driver!=null) {
				driver.close();
			}
		}	
		
		@Test
		public void registerSuccessfully() throws IOException{
			//加载到指定url
			navigation.to(baseUrl);
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);

			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
		    Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "password", ""));
			Assert.assertTrue(SeleniumUtils.isContentAppeared(driver, "Sign Up"));
			
			driver.findElements(By.tagName("a")).get(0).click();
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);

			List<WebElement> buttons = driver.findElements(By.tagName("input"));
			if(buttons.size()==0) {
				driver.navigate().refresh();
				buttons = driver.findElements(By.tagName("input"));
			}
			buttons.get(buttons.size()-1).getAttribute("value").equals("Submit");
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
			assertEquals(driver.getTitle(), ("Register here"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "first_name", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "last_name", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "password", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "address", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "contact", ""));
			Assert.assertTrue(SeleniumUtils.isContentAppeared(driver, "Sample Register Form"));
			
			driver.findElement(By.name("first_name")).sendKeys("Amber");
			driver.findElement(By.name("last_name")).sendKeys("Grace");
			driver.findElement(By.name("username")).sendKeys("Faith");
			driver.findElement(By.name("password")).sendKeys("123");
			driver.findElement(By.name("address")).sendKeys("street1");
			driver.findElement(By.name("contact")).sendKeys("987");
			
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "first_name", "Amber"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "last_name", "Grace"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", "Faith"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "password", "123"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "address", "street1"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "contact", "987"));
			
			
			buttons.get(buttons.size()-1).click();
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);

			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
		    Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "password", ""));
			Assert.assertTrue(SeleniumUtils.isContentAppeared(driver, "Sign Up"));
		}

		@Test
		public void registerFailedEmptyFirstName() throws IOException{
			//加载到指定url
			navigation.to(baseUrl);
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);

			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
		    Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "password", ""));
			Assert.assertTrue(SeleniumUtils.isContentAppeared(driver, "Sign Up"));
			
			driver.findElements(By.tagName("a")).get(0).click();
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "first_name", ""));
			
			//driver.findElement(By.name("first_name")).sendKeys("Amber");
			driver.findElement(By.name("last_name")).sendKeys("Grace");
			driver.findElement(By.name("username")).sendKeys("Faith");
			driver.findElement(By.name("password")).sendKeys("123");
			driver.findElement(By.name("address")).sendKeys("street1");
			driver.findElement(By.name("contact")).sendKeys("987");
			
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "first_name", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "last_name", "Grace"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", "Faith"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "password", "123"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "address", "street1"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "contact", "987"));
			
			List<WebElement> buttons = driver.findElements(By.tagName("input"));
			buttons.get(buttons.size()-1).getAttribute("value").equals("Submit");
			
			buttons.get(buttons.size()-1).click();
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);

			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "first_name", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "last_name", ""));
			Assert.assertTrue(SeleniumUtils.isContentAppeared(driver, "Sample Register Form"));
		}	

		@Test
		public void registerSuccessfulEmptyAddress() throws IOException{
			//加载到指定url
			navigation.to(baseUrl);
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
			if(driver.findElements(By.tagName("a")).size()==0) {
				driver.navigate().refresh();
			}
			driver.findElements(By.tagName("a")).get(0).click();
			
			driver.findElement(By.name("first_name")).sendKeys("Amber");
			driver.findElement(By.name("last_name")).sendKeys("Grace");
			driver.findElement(By.name("username")).sendKeys("Faith");
			driver.findElement(By.name("password")).sendKeys("123");
			//driver.findElement(By.name("address")).sendKeys("street1");
			driver.findElement(By.name("contact")).sendKeys("987");
			
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "password", "123"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "address", ""));
			
			List<WebElement> buttons = driver.findElements(By.tagName("input"));
			buttons.get(buttons.size()-1).click();
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
		    Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "password", ""));
			Assert.assertTrue(SeleniumUtils.isContentAppeared(driver, "Sign Up"));
		}	


		@Test
		public void registerFailedEmptyLastName() throws IOException{
			//加载到指定url
			navigation.to(baseUrl);
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
			//Assert.assertTrue(SeleniumUtils.verifyScreenshot(driver, "login.png"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
			driver.findElements(By.tagName("a")).get(0).click();
			//Assert.assertTrue(SeleniumUtils.verifyScreenshot(driver, "register.png"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "last_name", ""));
			
			driver.findElement(By.name("first_name")).sendKeys("Amber");
			//driver.findElement(By.name("last_name")).sendKeys("Grace");
			driver.findElement(By.name("username")).sendKeys("Faith");
			driver.findElement(By.name("password")).sendKeys("123");
			driver.findElement(By.name("address")).sendKeys("street1");
			driver.findElement(By.name("contact")).sendKeys("987");
			
			//Assert.assertTrue(SeleniumUtils.verifyScreenshot(driver, "register_info_empty_lastname.png"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "last_name", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", "Faith"));
			
			List<WebElement> buttons = driver.findElements(By.tagName("input"));
			buttons.get(buttons.size()-1).click();
			//Assert.assertTrue(SeleniumUtils.verifyScreenshot(driver, "register.png"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "first_name", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "last_name", ""));
			assertEquals(driver.getTitle(), ("Register here"));
		}	

		@Test
		public void registerFailedEmptyUserName() throws IOException{
			//加载到指定url
			navigation.to(baseUrl);
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
			driver.findElements(By.tagName("a")).get(0).click();
			
			driver.findElement(By.name("first_name")).sendKeys("Amber");
			driver.findElement(By.name("last_name")).sendKeys("Grace");
			//driver.findElement(By.name("username")).sendKeys("Faith");
			driver.findElement(By.name("password")).sendKeys("123");
			driver.findElement(By.name("address")).sendKeys("street1");
			driver.findElement(By.name("contact")).sendKeys("987");
			
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "address", "street1"));
			
			List<WebElement> buttons = driver.findElements(By.tagName("input"));
			buttons.get(buttons.size()-1).click();
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "address", ""));
			assertEquals(driver.getTitle(), ("Register here"));
		}	
		
		@Test
		public void registerFailedEmptyPassword() throws IOException{
			//加载到指定url
			navigation.to(baseUrl);
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
			if(driver.findElements(By.tagName("a")).size()==0) {
				driver.navigate().refresh();
			}
			driver.findElements(By.tagName("a")).get(0).click();
			
			driver.findElement(By.name("first_name")).sendKeys("Amber");
			driver.findElement(By.name("last_name")).sendKeys("Grace");
			driver.findElement(By.name("username")).sendKeys("Faith");
			//driver.findElement(By.name("password")).sendKeys("123");
			driver.findElement(By.name("address")).sendKeys("street1");
			driver.findElement(By.name("contact")).sendKeys("987");
			
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "password", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "first_name", "Amber"));
			
			List<WebElement> buttons = driver.findElements(By.tagName("input"));
			buttons.get(buttons.size()-1).click();
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
			SeleniumUtils.assertAndTakeSnapshot(driver, SeleniumUtils.isTextInInput(driver, "password", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "first_name", ""));
			assertEquals(driver.getTitle(), ("Register here"));
		}	

		@Test
		public void registerFailedUserNameDenver() throws IOException{
			//加载到指定url
			navigation.to(baseUrl);
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
			if(driver.findElements(By.tagName("a")).size()==0) {
				driver.navigate().refresh();
			}
			driver.findElements(By.tagName("a")).get(0).click();
			
			driver.findElement(By.name("first_name")).sendKeys("Amber");
			driver.findElement(By.name("last_name")).sendKeys("Grace");
			driver.findElement(By.name("username")).sendKeys("Denver");
			driver.findElement(By.name("password")).sendKeys("123");
			driver.findElement(By.name("address")).sendKeys("street1");
			driver.findElement(By.name("contact")).sendKeys("987");
			
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", "Denver"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "first_name", "Amber"));
			
			List<WebElement> buttons = driver.findElements(By.tagName("input"));
			buttons.get(buttons.size()-1).click();
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "first_name", ""));
			assertEquals(driver.getTitle(), ("Register here"));
		}	


		@Test
		public void registerSuccessfulEmptyContact() throws IOException{
			//加载到指定url
			navigation.to(baseUrl);
			driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
			//Assert.assertTrue(SeleniumUtils.verifyScreenshot(driver, "login.png"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
			if(driver.findElements(By.tagName("a")).size()==0) {
				driver.navigate().refresh();
			}
			driver.findElements(By.tagName("a")).get(0).click();
			//Assert.assertTrue(SeleniumUtils.verifyScreenshot(driver, "register.png"));
			
			driver.findElement(By.name("first_name")).sendKeys("Amber");
			driver.findElement(By.name("last_name")).sendKeys("Grace");
			driver.findElement(By.name("username")).sendKeys("Faith");
			driver.findElement(By.name("password")).sendKeys("123");
			driver.findElement(By.name("address")).sendKeys("street1");
			//driver.findElement(By.name("contact")).sendKeys("987");
			
			//Assert.assertTrue(SeleniumUtils.verifyScreenshot(driver, "register_info_empty_contact.png"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "address", "street1"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "contact", ""));
			
			List<WebElement> buttons = driver.findElements(By.tagName("input"));
			buttons.get(buttons.size()-1).click();
			//Assert.assertTrue(SeleniumUtils.verifyScreenshot(driver, "login_return_from_register.png"));
			Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "username", ""));
		    Assert.assertTrue(SeleniumUtils.isTextInInput(driver, "password", ""));
			Assert.assertTrue(SeleniumUtils.isContentAppeared(driver, "Sign Up"));
		}	


}
