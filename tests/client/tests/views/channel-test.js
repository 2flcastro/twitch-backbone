var test = require('tape');
var sinon = require('sinon');

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


  test('Handler for "toggleFilterVisible" event works properly', function(t) {
    // ARRANGE
    // Create sinon spy for "toggleFilterVisible" handler
    sinon.spy(ChannelView.prototype, 'toggleFilterVisible');


    // ACT
    // Create fake model and instance of Channel view, trigger toggleFilterVisible and toggleMatchVisible events
    var firstChannelModel = new ChannelModel({ name: 'Channel 1', twitchId: 1, streaming: true });
    var secondChannelModel = new ChannelModel({ name: 'Channel 2', twitchId: 3, streaming: false});
    var firstChannelView = new ChannelView({ model: firstChannelModel });
    var secondChannelView = new ChannelView({ model: secondChannelModel });


    // ASSERT
    firstChannelModel.trigger('toggleFilterVisible', 'all');
    t.ok(firstChannelView.toggleFilterVisible.calledOnce, 'The "toggleFilterVisible" method was called once');
    t.equal(firstChannelView.$el.hasClass('u-hidden'), false, 'The view is not hidden on "all" filter');

    firstChannelModel.trigger('toggleFilterVisible', 'streaming');
    t.ok(firstChannelView.toggleFilterVisible.calledTwice, 'The "toggleFilterVisible" method was called twice');
    t.equal(firstChannelView.$el.hasClass('u-hidden'), false, 'The view is not hidden on "streaming" filter');

    firstChannelModel.trigger('toggleFilterVisible', 'offline');
    t.ok(firstChannelView.toggleFilterVisible.calledThrice, 'The "toggleFilterVisible" method was called thrice');
    t.equal(firstChannelView.$el.hasClass('u-hidden'), true, 'The view is hidden on "offline" filter');


    // Test second, not streaming, channel model
    secondChannelModel.trigger('toggleFilterVisible', 'all');
    t.equal(secondChannelView.$el.hasClass('u-hidden'), false, 'The view is not be hidden on "all" filter');

    secondChannelModel.trigger('toggleFilterVisible', 'streaming');
    t.equal(secondChannelView.$el.hasClass('u-hidden'), true, 'The view is hidden on "streaming" filter');

    secondChannelModel.trigger('toggleFilterVisible', 'offline');
    t.equal(secondChannelView.$el.hasClass('u-hidden'), false, 'The view is not hidden on "offline" filter');


    // Restore sinon spies
    ChannelView.prototype.toggleFilterVisible.restore();
    t.end();
  });


  test('Handler for "toggleMatchVisible" works properly', function(t) {
    // ARRANGE
    // Create sinon spy for "toggleMatchVisible" handler
    sinon.spy(ChannelView.prototype, 'toggleMatchVisible');


    // ACT
    // Create fake model and instance of Channel view, trigger toggleFilterVisible and toggleMatchVisible events
    var channelModel = new ChannelModel({ name: 'Channel 1' });
    var channelView = new ChannelView({ model: channelModel });


    // ASSERT
    // Trigger "toggleMatchVisible" with non matching search query
    channelModel.trigger('toggleMatchVisible', null);
    t.ok(channelView.toggleMatchVisible.calledOnce, 'The channel view "toggleMatchVisible" event is triggered')
    t.equal(channelView.$el.hasClass('u-hidden'), true, 'The view is hidden for a non-matching search query');
    // Trigger "toggleMatchVisible" event with matching search query
    channelModel.trigger('toggleMatchVisible', true);
    t.equal(channelView.$el.hasClass('u-hidden'), false, 'The view visibile for a matching search query');

    // Restore sinon spy
    ChannelView.prototype.toggleMatchVisible.restore();
    t.end();
  });


  test('Channel view is removed when the model is destroyed', function(t) {
    // ARRANGE
    // Create sinon spies for envet handler functions
    sinon.spy(ChannelView.prototype, 'remove');

    // Create fake model and instance of Channel view
    var fakeModel = new ChannelModel();
    var channel = new ChannelView({ model: fakeModel });

    // ACT
    fakeModel.destroy();

    // ASSERT
    t.ok(channel.remove.calledOnce, 'The Channel view method is called when model is destroyed');

    // Restore sinon spies
    ChannelView.prototype.remove.restore();
    t.end();
  });
};
