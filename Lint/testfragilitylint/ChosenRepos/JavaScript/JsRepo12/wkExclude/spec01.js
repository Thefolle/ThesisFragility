/**
 * Created by online on 5/12/14.
 */
exports.config = {
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

    specs: [
        'spec01.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    }
};
