var test = require('tape');

var ChannelView = require('../../../../src/backbone/views/channel');
var ChannelModel = require('../../../../src/backbone/models/channel');

module.exports = function() {
  test('Channel view renders properly', function(t) {
    // ARRANGE + ACT - create new instance of Channel view with a fake channel model passed in
    var fakeModel = new ChannelModel({
      twitchId: 123456,
      name: 'Fake Channel',
      closed: false,
      url: 'https://...',
      logo: 'https://...',
      followers: 100,
      channelStatus: 'Fake Channel is streaming',
      streaming: true,
      streamDescription: 'Fake Game Title',
      viewers: 10,
      streamPreview: 'https://...'
    });
    var channel = new ChannelView({ model: fakeModel });

    // ASSERT
    t.equal(channel.render(), channel, 'Rendering channel view will return itself');
    // Test whether the view renders it's template DOM properly
    t.equal(channel.el.tagName, 'DIV', 'Channel view el renders with "div" element');
    t.ok(channel.el.classList.contains('channel-container'), 'Channel view el has the class "channel-container"');
    t.equal(channel.$el.has('div.channel-profile-block').length, 1, 'Channel view has a child div with class "channel-profile-block"');
    t.equal(channel.$el.find('.channel-profile__img').attr('src'), 'https://...', 'Channel view sets profile image url properly');
    t.equal(channel.$el.find('.channel-profile__followers span').text(), '100 Followers', 'Channel view sets number of followers properly');
    t.equal(channel.$el.find('.channel-titles__title').text(), 'Fake Channel', 'Channel views sets name of channel properly');
    t.equal(channel.$el.find('.channel-titles__stream').text(), 'Fake Game Title', 'Channel view sets stream description of channel properly');
    t.equal(channel.$el.find('.channel-titles__status').text(), 'Fake Channel is streaming', 'Channel view sets stream description of channel properly');
    t.equal(channel.$el.find('.channel-titles__viewers').text(), '10 Viewers', 'Channel view sets stream description of channel properly');
    t.equal(channel.$el.find('.channel-titles button').parent().attr('href'), 'https://...', 'Channel view stream url is set properly');
    t.equal(channel.$el.find('.channel-stream a').attr('href'), 'https://...', 'Channel view stream preview url is set properly');
    t.equal(channel.$el.find('.channel-stream img').attr('src'), 'https://...', 'Channel view stream preview image src is set properly');

    t.ok(channel.model instanceof ChannelModel, 'Channel view\'s model is an instance of Channel model');

    t.end();
  });
};
