var $ = require('jquery');
var Backbone = require('backbone');

var ChannelsListView = require('../views/channelsList');

var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'view/channels': 'viewChannels',
    'search/channels/:query': 'searchChannels',
    'edit/channels': 'editChannels'
  },

  home: function() {
    // Redirect to 'view/channels' route
    this.navigate('view/channels', { trigger: true });
  },

  viewChannels: function() {
    // Remove previous view
    this.removeCurrentView();

    // Create new ChannelsListView and render it
    var channelsListView = new ChannelsListView();
    $('#app').html(channelsListView.render().el);


    // Update the router's current view
    this.currentView = channelsListView;
  },

  searchChannels: function(query) {
    // Remove previous view
    this.removeCurrentView();

    // ...
  },

  editChannels: function() {
    // Remove previous view
    this.removeCurrentView();

    // ...
  },

  // Keep track of current view, defaults to 'null'
  currentView: null,

  removeCurrentView: function() {
    // Removes the router's current view from DOM
    if (this.currentView) {
      this.currentView.trigger('remove');
      this.currentView.remove();
      this.currentView = null;
    }
  },

  start: function() {
    Backbone.history.start();
  },

  stop: function() {
    // For unit testing puroses
    Backbone.history.stop();
  }
});

module.exports = Router;
