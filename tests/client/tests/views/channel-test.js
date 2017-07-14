var test = require('tape');

var ChannelView = require('../../../../src/backbone/views/channel');
var ChannelModel = require('../../../../src/backbone/models/channel');

module.exports = function() {
  test('Channel view renders properly', function(t) {
    // ARRANGE + ACT - create new instance of Channel view with a fake channel model passed in
    var fakeModel = new ChannelModel({ name: 'Fake Channel', twitchId: 1 });
    var channel = new ChannelView({ model: fakeModel });

    // ASSERT
    t.equal(channel.render(), channel, 'Rendering channel view will return itself');
    t.equal(channel.el.tagName, 'DIV', 'Channel view el renders with "div" element');
    t.ok(channel.el.classList.contains('channel-container'), 'Channel view el has the class "channel-container"')
    t.ok(channel.model instanceof ChannelModel, 'Channel view\'s model is an instance of Channel model');

    t.end();
  });
};
