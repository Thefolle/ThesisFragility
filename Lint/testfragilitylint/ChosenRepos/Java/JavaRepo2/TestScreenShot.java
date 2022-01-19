package AutomatedTests;


import java.io.File;

import org.apache.commons.io.FileUtils;

import org.openqa.selenium.OutputType;

import org.openqa.selenium.TakesScreenshot;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;




public class TestScreenShot {

   

    public static void main(String args[]) throws Exception{

    	System.setProperty("webdriver.chrome.driver","/Users/nagen/Downloads/chromedriver");
		WebDriver driver = new ChromeDriver();		

        //goto url

        driver.get("http://images.google.com");

        //Call take screenshot function

        TestScreenShot.takeSnapShot(driver, "/Users/nagen/Downloads/test.png") ;     
        Thread.sleep(2000);
        driver.close();
    }

    /**

     * This function will take screenshot

     * @param webdriver

     * @param fileWithPath

     * @throws Exception

     */

    public static void takeSnapShot(WebDriver webdriver,String fileWithPath) throws Exception{

        //Convert web driver object to TakeScreenshot

        TakesScreenshot scrShot =((TakesScreenshot)webdriver);

        //Call getScreenshotAs method to create image file

                File SrcFile=scrShot.getScreenshotAs(OutputType.FILE);
                
            //Move image file to new destination

                File DestFile=new File(fileWithPath);

                //Copy file at destination

                FileUtils.copyFile(SrcFile, DestFile);

    }

}

