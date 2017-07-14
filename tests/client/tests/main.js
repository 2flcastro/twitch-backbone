// ------------------------------------
// MAIN TEST FILE FOR CLIENT UNIT TESTS
// ------------------------------------

// BACKBONE ROUTER TESTS
var routerTests = require('./routers/router-test');
routerTests();

// BACKBONE MODELS TESTS
var channelModelTests = require('./models/channel-test');
channelModelTests();

// BACKBONE COLLECTIONS TESTS
var channelsCollectionTests = require('./collections/channels-test');
channelsCollectionTests();


// BACKBONE VIEWS TESTS
// channel vIEW
var channelViewTests = require('./views/channel-test');
channelViewTests();
