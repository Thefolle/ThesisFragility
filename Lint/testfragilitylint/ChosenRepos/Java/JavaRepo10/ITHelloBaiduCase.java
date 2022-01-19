/*
 * Copyright (c) 2008-2016 Computer Network Information Center (CNIC), Chinese Academy of Sciences.
 * 
 * This file is part of Duckling project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 *
 */
package integration;

import junit.framework.Assert;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import com.thoughtworks.selenium.DefaultSelenium;
import com.thoughtworks.selenium.Selenium;


public class ITHelloBaiduCase {
    private static Selenium selenium;
    
    @BeforeClass
    public static void setUp() throws Exception {  
        selenium = new DefaultSelenium("localhost", 4444, "*iexplore", "http://www.baidu.com");  
        selenium.start();  
    }  

    @AfterClass
    public static void tearDown() throws Exception {  
        //selenium.stop();
    }  

    @Test
    public void testBaidu() throws Exception {  
        selenium.open("http://www.baidu.com");  
        selenium.waitForPageToLoad("6000");  
        selenium.type("kw", "selenium");  
        selenium.click("su");  
        selenium.waitForPageToLoad("6000");
        Assert.assertTrue(selenium.isTextPresent("python"));  
    }  

}
