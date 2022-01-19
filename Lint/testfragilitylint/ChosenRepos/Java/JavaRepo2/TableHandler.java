package AutomatedTests;

import java.text.ParseException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;



public class TableHandler {
    public static void main(String[] args) throws ParseException {
    	
    	System.setProperty("webdriver.chrome.driver","/Users/nagen/Downloads/chromedriver");
	 	WebDriver wd = new ChromeDriver();	
        wd.get("http://demo.guru99.com/test/web-table-element.php");         
        //No.of Columns
        List <WebElement>  col = wd.findElements(By.xpath(".//*[@id=\"leftcontainer\"]/table/thead/tr/th"));
        System.out.println("No of cols are : " +col.size()); 
        //No.of rows 
        List <WebElement> rows = wd.findElements(By.xpath(".//*[@id='leftcontainer']/table/tbody/tr/td[1]")); 
        System.out.println("No of rows are : " + rows.size());
        
        wd.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
		 WebElement baseTable = wd.findElement(By.tagName("table"));
		  
		 //To find third row of table
		 WebElement tableRow = baseTable.findElement(By.xpath("//*[@id=\"leftcontainer\"]/table/tbody/tr[3]"));
        String rowtext = tableRow.getText();
		 System.out.println("Third row of table : "+rowtext);
		    
		    //to get 3rd row's 2nd column data
	    	    WebElement cellIneed;
		   cellIneed = tableRow.findElement(By.xpath("//*[@id=\"leftcontainer\"]/table/tbody/tr[3]/td[2]"));
		    String valueIneed = cellIneed.getText();
		    System.out.println("Third Row 2nd column contains:" + valueIneed);
		   
	    
	            /*WebElement cellIneed;
		    int i=0;
		    String xp;
		    for (i=1;i<rows.size();i++) {
		    	xp="//*[@id=\"leftcontainer\"]/table/tbody/tr["+i+"]/td[1]";
		    	cellIneed = tableRow.findElement(By.xpath(xp));
		    	String valueIneed = cellIneed.getText();
		    	System.out.println("Cell value is : " + valueIneed); 
		    } */
        try {
        	Thread.sleep(5000);
        }
        catch (Exception e) {}
       // wd.close();
    }
}
