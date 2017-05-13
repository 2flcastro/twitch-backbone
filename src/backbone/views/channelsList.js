var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
var fs = require('fs');

var ChannelView = require('./channel');
var ChannelModel = require('../models/channel');

var template = fs.readFileSync(__dirname + '/../templates/channelsList.hbs', { encoding: 'utf8' });

module.exports = Backbone.View.extend({
  className: 'channels-list',

  template: Handlebars.compile(template),

  render: function() {
    this.$el.html(this.template());

    // Create a view for each channel in collection and add to channelList parent view
    var _this = this;
    this.collection.each(function(channel) {
      var channelView = new ChannelView({ model: channel });
      _this.$el.prepend(channelView.render().el);
    });

    return this;
  }
});
