var Backbone = require('backbone'),
    ChannelModel = require('../models/channel');


var ChannelsCollection = Backbone.Collection.extend({
  model: ChannelModel
});

// Create some fake models for testing purposes
var channel_1 = {
  accountClosed: false,
  profileImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/test_channel-profile_image-94a42b3a13c31c02-300x300.jpeg',
  followers: 1000,
  title: 'Streaming Channel Title',
  streaming: true,
  streamDesc: 'Streaming: Amazing Game',
  viewers: 1000,
  streamPreview: 'https://static-cdn.jtvnw.net/ttv-static/404_preview-640x360.jpg',
  channelUrl: 'https://www.twitch.tv/test_channel'
};

var channel_2 = {
  accountClosed: false,
  profileImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/test_channel-profile_image-94a42b3a13c31c02-300x300.jpeg',
  followers: 398,
  title: 'Currently Offline Title',
  streaming: false,
  streamDesc: 'Offline',
  viewers: 0,
  streamPreview: 'https://static-cdn.jtvnw.net/ttv-static/404_preview-640x360.jpg',
  channelUrl: 'https://www.twitch.tv/test_channel'
};

var channel_3 = {
  accountClosed: true,
  profileImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/test_channel-profile_image-94a42b3a13c31c02-300x300.jpeg',
  followers: 0,
  title: 'Account Closed Title',
  streaming: false,
  streamDesc: 'Offline',
  viewers: 0,
  streamPreview: 'https://static-cdn.jtvnw.net/ttv-static/404_preview-640x360.jpg',
  channelUrl: 'https://www.twitch.tv/test_channel'
};

var channelsList = new ChannelsCollection();

// Add sample channels to collection
channelsList.add([channel_1, channel_2, channel_3]);

// For testing purposes export this instance of collection
module.exports = channelsList;

// module.exports = new ChannelsCollection();
