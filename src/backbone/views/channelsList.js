var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var ChannelView = require('./channel');
var ChannelModel = require('../models/channel');
var ChannelsCollection = require('../collections/channels');

module.exports = Backbone.View.extend({
  className: 'channels-list',

  initialize: function() {
    // Set collection
    this.collection = new ChannelsCollection();

    // Set event listener
    this.listenTo(this.collection, 'add', this.addChannel);
    this.on('remove', function() { this.collection.reset() }, this);
  },

  render: function() {
    this.collection.fetch();

    return this;
  },

  addChannel: function(channel) {
    var channelView = new ChannelView({ model: channel });
    this.$el.append(channelView.render().el);
  }
});
