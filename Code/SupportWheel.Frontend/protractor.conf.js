exports.config = {
  allScriptsTimeout: 11000,

    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    '**/*.e2e.js'

  ],

    // If you would like to run more than one instance of webdriver on the same
    // tests, use multiCapabilities, which takes an array of capabilities.
    // If this is specified, capabilities will be ignored.
    multiCapabilities: [
        {
            'browserName': 'chrome',
            'shardTestFiles': true,
            'maxInstances': 1
        }
//        ,{
//            'browserName': 'firefox',
//            'shardTestFiles': true,
//            'maxInstances': 10
//        }
    ],

    //Configura o tamanho da janela a abrir
//  onPrepare: function() {
//    browser.driver.manage().window().setSize(1600, 800);
//  },
  baseUrl: 'http://localhost:3000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    // Default time to wait in ms before a test fails.
    //defaultTimeoutInterval: 180000,

    // onComplete will be called just before the driver quits.
    //onComplete: null,

    // If true, display spec names.
    isVerbose: true,

    // If true, print colors to the terminal.
    showColors: true,

    // If true, include stack traces in failures.
    //includeStackTrace: true


  }
};
