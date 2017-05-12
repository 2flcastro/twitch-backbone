var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');

var ChannelsListView = require('./views/channelsList');

// Intitial test
console.log(typeof $);
console.log(typeof _);
console.log(typeof Backbone);
console.log(typeof Backbone.$);


channelsList = new ChannelsListView();
channelsList.render();
channelsList.addChannels();
