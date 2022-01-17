/**
 * Created by online on 15/12/14.
 * protractor protest/confcj.js
 */
// conf.js
exports.config = {
    allScriptsTimeout: 99999,

    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Capabilities to be passed to the webdriver instance.

    capabilities: {
        'browserName': 'firefox'
    },


    //baseUrl: 'http://localhost:8000/',

    //framework: 'cucumber',
    /*
    multiCapabilities: [{
        browserName: 'firefox'
    }, {
        browserName: 'chrome'
    }
        ],
        */

    specs: ['../protest/wkinclude/taxonlinelogingoogle6.js']
}
