var $ = require('jquery');
var Backbone = require('backbone');

var ChannelView = require('./channel');
var ChannelModel = require('../models/channel');

module.exports = Backbone.View.extend({
  // Will render a <div> with class "channel-list" as view container
  className: 'channels-list',

  render: function() {
    // Create a view for each channel in collection and add to channelList parent view
    var _this = this;
    this.collection.each(function(channel) {
      var channelView = new ChannelView({ model: channel });
      _this.$el.prepend(channelView.render().el);
    });

    return this;
  }
});
