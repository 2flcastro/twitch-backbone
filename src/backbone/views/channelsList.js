var $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    fs = require('fs');

var ChannelView = require('./channel');

var template = fs.readFileSync(__dirname + '/../templates/channelsList.hbs', {encoding: 'utf8'});

var channelData = {
  profileImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/test_channel-profile_image-94a42b3a13c31c02-300x300.jpeg',
  followers: 1000,
  title: 'name_of_channel',
  streaming: true,
  stream: 'Streaming: Title of streaming content',
  viewers: 1000,
  streamUrl: 'https://www.twitch.tv/test_channel',
  streamPreview: 'https://static-cdn.jtvnw.net/ttv-static/404_preview-640x360.jpg',
  channelUrl: 'https://www.twitch.tv/test_channel'
}

var closedChannel = {
  accountClosed: true,
  profileImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/test_channel-profile_image-94a42b3a13c31c02-300x300.jpeg',
  followers: 0,
  title: 'closedChannel_Name',
  streaming: false,
  stream: null,
  viewers: 0,
  streamUrl: 'https://www.twitch.tv/test_channel',
  streamPreview: 'https://static-cdn.jtvnw.net/ttv-static/404_preview-640x360.jpg',
  channelUrl: 'https://www.twitch.tv/test_channel'
}



module.exports = Backbone.View.extend({
  el: '#app',

  template: Handlebars.compile(template),

  initialize: function() {
    console.log('initialized channels list view');
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  addChannels: function() {
    var channel = new ChannelView();
    var channel_closed = new ChannelView();

    channel.channelData = channelData;
    channel_closed.channelData = closedChannel;
    // this.$el.prepend(channel.render().el);
    this.$('.channels-list').prepend(channel.render().el);
    this.$('.channels-list').prepend(channel_closed.render().el);
  }
});
