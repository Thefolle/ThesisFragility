package uitest;

import java.awt.image.BufferedImage;
import java.awt.image.DataBuffer;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/***
 * Note: make sure all benchmark images are copied from resources to resourcesraw from eclipse, do not rename 
 *
 */
public class SeleniumUtils {
	private static String systemPath = "/Users/fangfanghu/Documents/All/Careers/202002job-hunting/Companies/skycope/QA_assignment/qa_assignment/";
	
	public static boolean verifyScreenshot(WebDriver driver, String name) throws IOException {
		File fileA=new File(systemPath + "selenium/resources/" + name);
		//if(!fileA.exists()) {
			File screenShot=((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
			FileUtils.copyFile(screenShot, fileA);
		//}
		File fileB=new File(systemPath + "selenium/resourcesraw/" + name);
		BufferedImage dataInput=ImageIO.read(fileA);
		DataBuffer bufferFileA=dataInput.getData().getDataBuffer();
		int FileA=bufferFileA.getSize();
		BufferedImage dataOutPut=ImageIO.read(fileB);
		DataBuffer bufferFileB=dataOutPut.getData().getDataBuffer();
		int FileB=bufferFileB.getSize();
		Boolean matchimg=false;
		if (FileA==FileB) {
			matchimg=true;
			for (int i = 0; i < FileA; i++) {
				if (bufferFileA.getElem(i)!=bufferFileB.getElem(i)) {
					matchimg=false;
					break;
				}
			}
		}else {
			matchimg=false;
		}

		return matchimg;
	}
	
	public static boolean isContentAppeared(WebDriver driver,String content) {  
	    boolean status = false;  
	    try {  
	        WebElement we = driver.findElement(By.xpath("//*[contains(.,'" + content + "')]")); 
	        status = we.isDisplayed();
	        if(!status) {
		    	driver.navigate().refresh();
		    	System.out.println(content + " is appeard!");  
		    	driver.navigate().refresh();
		    	we = driver.findElement(By.xpath("//*[contains(.,'" + content + "')]")); 
		        status = we.isDisplayed();
	        }  
	        System.out.println(content + " is appeard!");  
	    } catch (NoSuchElementException e) {  
	        System.out.println("'" + content + "' doesn't exist!");  
	    }  
	    
	    return status;  
	}  
	
	public static boolean isTextInInput(WebDriver driver,String inputName, String inputText) {  
	    boolean status = false;  
	    try {  
	    	status = driver.findElement(By.name(inputName)).getAttribute("value").equals(inputText);
	    	 if(!status) {
	 	    	driver.navigate().refresh();
	 	    	System.out.println(driver.findElement(By.name(inputName)).getAttribute("value") + " is appeard!"); 
	 	    	driver.navigate().refresh();
	 	    	status = driver.findElement(By.name(inputName)).getAttribute("value").equals(inputText);
	    	 }
	        System.out.println(driver.findElement(By.name(inputName)).getAttribute("value") + " is appeard!");  
	    } catch (NoSuchElementException e) {  
	        System.out.println("'" + inputText + "' doesn't exist!");  
	    }  
	    
	    return status;  
	}  
	
	public static void assertAndTakeSnapshot(WebDriver driver, boolean b) throws IOException {
		
		if(!b) {
			Date now = new Date(); 
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");//可以方便地修改日期格式
			File fileA=new File(systemPath + "selenium/resources/" + "Failed_"+dateFormat.format(now));
			File screenShot=((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
			FileUtils.copyFile(screenShot, fileA);
		}
		Assert.assertTrue(b);
		
	}

}
