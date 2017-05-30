var express = require('express');

// 'channels' ROUTER
var router = express.Router();

// ROUTE HANDLERS
var channels = require('../handlers/channels');

// ROUTES
router.get('/channels-list', channels.list);

module.exports = router;
