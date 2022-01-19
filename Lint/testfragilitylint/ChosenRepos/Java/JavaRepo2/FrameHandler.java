package AutomatedTests;

import org.openqa.selenium.By;		
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class FrameHandler {
public static void main(String[] args) {

	System.setProperty("webdriver.chrome.driver","/Users/nagen/Downloads/chromedriver");
	WebDriver driver = new ChromeDriver();
	    driver.get("http://demo.guru99.com/test/guru99home/"); 
	       // navigates to the page consisting an iframe

	       driver.manage().window().maximize();
	       driver.switchTo().frame("a077aa5e"); //switching the frame by ID

			System.out.println("Switching to the frame");
     		driver.findElement(By.xpath("html/body/a/img")).click();
  		    //Clicks the iframe
       
  			System.out.println("Done!");
      }
}	
