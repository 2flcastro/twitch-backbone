// Main server-side test runner

// Setup local environment variables
// - Twitch Client ID is needed for channels route handler tests
require('dotenv').config();

// Express Routes Tests
var channelsRouteTests = require('./route-handlers/channels-test');

// Run Tests
channelsRouteTests();
