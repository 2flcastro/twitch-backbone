var $ = require('jquery');
var Backbone = require('backbone');

var ChannelView = require('./channel');
var ChannelModel = require('../models/channel');
var channels = require('../collections/channels');

module.exports = Backbone.View.extend({
  // Will render a <div> with class "channel-list" as view container
  className: 'channels-list',

  initialize: function() {
    this.collection = channels;

    // As each channel is added from server, add it to parent view
    this.listenTo(this.collection, 'add', this.addChannel);
  },

  render: function() {
    // Get list of channels from server
    this.collection.fetch();

    return this;
  },

  addChannel: function(channel) {
    var channelView = new ChannelView({ model: channel });
    this.$el.prepend(channelView.render().el);
  }
});
