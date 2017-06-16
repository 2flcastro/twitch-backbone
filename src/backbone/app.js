var $ = require('jquery');
var Backbone = require('backbone');

// var ChannelsListView = require('./views/channelsList');
var Router = require('./routers/router');

// Start the router, router.start() calls Backbone.history.start()
var router = new Router();
router.start();
