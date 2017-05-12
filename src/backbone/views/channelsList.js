var $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    fs = require('fs');

var ChannelView = require('./channel'),
    ChannelModel = require('../models/channel'),
    channelsList = require('../collections/channels');

var template = fs.readFileSync(__dirname + '/../templates/channelsList.hbs', { encoding: 'utf8' });

module.exports = Backbone.View.extend({
  el: '#app',

  template: Handlebars.compile(template),

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  addChannels: function() {
    // Make reference 'this' context
    var _this = this;

    // Create a view for each channel in collection and add to channelList parent view
    channelsList.each(function(channel) {
      var channelView = new ChannelView({ model: channel });
      _this.$('.channels-list').prepend(channelView.render().el);
    });
  }
});
