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
<<<<<<< HEAD

=======
>>>>>>> 6bacee24b6af98969d9300150162d8fa10cc3383
package integration;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.thoughtworks.selenium.DefaultSelenium;
import com.thoughtworks.selenium.Selenium;

public class ITLoginTest {
    
    private Selenium selenium;
    
	//@Before
	public void setUp() throws Exception {
		selenium = new DefaultSelenium("localhost", 4444, "*googlechrome", "http://localhost:8080/dhome/");
		selenium.start();
	}

	//@Test
	public void testLogin() throws Exception {
		selenium.open("/dhome/");
<<<<<<< HEAD
		selenium.type("id=inputIcon", "xxxx");
		selenium.type("name=password", "PASSWORD");
=======
		selenium.type("id=inputIcon", "some@cnic.cn");
		selenium.type("name=password", "123456");
>>>>>>> 6bacee24b6af98969d9300150162d8fa10cc3383
		selenium.click("css=button.btn");
		selenium.waitForPageToLoad("30000");
		selenium.click("link=个人资料");
		selenium.waitForPageToLoad("30000");
		selenium.click("link=退出");
		selenium.waitForPageToLoad("30000");
	}

	//@After
	public void tearDown() throws Exception {
		selenium.stop();
	}
}
