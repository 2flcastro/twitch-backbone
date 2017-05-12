var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');

var ChannelsListView = require('./views/channelsList');


channelsList = new ChannelsListView();
channelsList.render();
channelsList.addChannels();
