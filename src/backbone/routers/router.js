var $ = require('jquery');
var Backbone = require('backbone');

var ChannelsListView = require('../views/channelsList');

// Collection of channels
var channels = require('../collections/channels');

var Router = Backbone.Router.extend({
  routes: {
    '': 'viewChannels',
    'editchannels': 'editChannels'
  },

  viewChannels: function() {
    if (this.currentView) this.currentView.remove();
    console.log('you are now viewing all channels');

    var channelsListView = new ChannelsListView();
    channelsListView.collection = channels;
    $('#app').html(channelsListView.render().el);

    this.currentView = channelsListView;
  },

  editChannels: function() {
    console.log('you are now editing channels');

    if (this.currentView) this.currentView.remove();

  },

  // Keep track of current view to remove properly when needed
  currentView: null,

  start: function() {
    Backbone.history.start();
  }
});

module.exports = new Router();
