package SeleniumTest;

import org.openqa.selenium.By;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class AutoITScriptTest {
	private static WebDriver driver;
	
	  public static void main(String[] args) {
	      // declaration and instantiation of objects/variables
	  //	System.setProperty("webdriver.gecko.driver","C:\\geckodriver.exe");
		//	WebDriver driver = new FirefoxDriver();
			//comment the above 2 lines and uncomment below 2 lines to use Chrome
			System.setProperty("webdriver.chrome.driver","C:\\Users\\nvmur\\Downloads\\chromedriver_win32\\chromedriver.exe");
		    driver = new ChromeDriver();
	  	
	      String baseUrl =  "http://www.tinyupload.com";
	        
	      
	      
	      // launch  and direct it to the Base URL
	      driver.get(baseUrl);
	      
	      try {
	    	 //   driver.manage().window().setSize(new Dimension(755, 716));
	          // driver.findElement(By.name("uploaded_file")).click();
	           Actions builder = new Actions(driver);
	           builder.moveToElement(driver.findElement(By.xpath("//input[@type='file']"))).click().build().perform();
	    	 Thread.sleep(2000);
	    	 System.out.println("About to find the element");
	    	// WebElement we = driver.findElement(By.xpath("//input[@type='file']"));
	    	  WebElement we = driver.findElement(By.name("uploaded_file"));
	    	 if (we.isDisplayed()) {
	    		 System.out.println(we.getText());
	    	  }
	          else {
	    	     System.out.println("no dice");
	    	  }
	    	  Thread.sleep(2000);
	    	  System.out.println("About to run the script");
	    	   Runtime.getRuntime().exec("C:\\Users\\nvmur\\Downloads\\TinyFile.exe");
	    	  System.out.println("DONE");
	    	   Thread.sleep(3000);
	      
	      }
	      catch (Exception e1) {
	      	e1.printStackTrace();
	      }
	      
	      
	      
	     
	      //close Chrome
	    //  driver.close();
	     
	  }

	
	  


	}

