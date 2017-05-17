var $ = require('jquery');
var Backbone = require('backbone');

var ChannelsListView = require('../views/channelsList');
var ChannelsCollection = require('../collections/channels');

var Router = Backbone.Router.extend({
  routes: {
    '': 'viewChannels',
    'view-channels': 'viewChannels',
    'search-channels/:query': 'searchChannels',
    'edit-channels': 'editChannels'
  },

  viewChannels: function() {
    // Remove previous views
    if (this.currentView) {
      this.currentView.trigger('remove');
      this.currentView.remove();
    }


    // Set collection for new view
    var channelsCollection = new ChannelsCollection();
    channelsCollection.url = '/channels/channels-list';
    // Create new view
    var channelsListView = new ChannelsListView({ collection: channelsCollection });
    // Render new view
    $('#app').html(channelsListView.render().el);


    // Set the currentView for router
    this.currentView = channelsListView;
  },

  searchChannels: function(query) {
    if (this.currentView) {
      this.currentView.trigger('remove');
      this.currentView.remove();
    }

    console.log('searched for : ', query);

    // ...
  },

  editChannels: function() {
    if (this.currentView) {
      this.currentView.trigger('remove');
      this.currentView.remove();
    }

    console.log('you are now editing channels');

    // ...
  },

  // Keep track of current view to remove when needed
  currentView: null,

  start: function() {
    Backbone.history.start();
  }
});

module.exports = new Router();
