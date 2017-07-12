var test = require('tape');

// Channel Model
var Channel = require('../../../../src/backbone/models/channel');

module.exports = function() {
  test('Channel model has default attributes', function(t) {
    // ARRANGE - create new instance of model
    var channel = new Channel();

    // ASSERT
    t.equal(channel.get('twitchId'), 0, 'Default twitchId is null');
    t.equal(channel.get('name'), '...', 'Default channel name is empty');
    t.equal(channel.get('closed'), false, 'Default channel is not closed');
    t.equal(channel.get('url'), '...', 'Default url is empty');
    t.equal(channel.get('logo'), '...', 'Default logo is empty');
    t.equal(channel.get('followers'), 0, 'Default channel has 0 followers');
    t.equal(channel.get('channelStatus'), '...', 'Default channel status is empty')
    t.equal(channel.get('streaming'), false, 'Default channel is not streaming');
    t.equal(channel.get('streamDescription'), 'Offline', 'Default streaming description is "Offline"');
    t.equal(channel.get('viewers'), 0, 'Default channels viewers is 0');
    t.equal(channel.get('streamPreview'), '...', 'Default stream preview is empty');

    // End test case
    t.end();
  });


  test('Channel model sets attributes appropriately', function(t) {
    // ARRANGE - create new insteance of channel model with defaults passed in
    var channel = new Channel({
      twitchId: 123456,
      name: 'Test Channel Name',
      closed: false,
      url: 'https://...',
      logo: 'https://...',
      followers: 100,
      channelStatus: 'Status of current stream',
      streaming: false,
      streamDescription: 'Streaming a test...',
      viewers: 10,
      streamPreview: 'https://...'
    });

    // Assert
    t.equal(channel.get('twitchId'), 123456, 'Sets channel twitchId');
    t.equal(channel.get('name'), 'Test Channel Name', 'Sets channel name');
    t.equal(channel.get('closed'), false, 'Sets closed to false');
    t.equal(channel.get('url'), 'https://...', 'Sets channel url');
    t.equal(channel.get('logo'), 'https://...', 'sets logo url');
    t.equal(channel.get('followers'), 100, 'Sets followers count');
    t.equal(channel.get('channelStatus'), 'Status of current stream', 'Sets channelStatus');
    t.equal(channel.get('streaming'), false, 'Sets streaming to false');
    t.equal(channel.get('streamDescription'), 'Streaming a test...', 'Sets streaming description');
    t.equal(channel.get('viewers'), 10, 'Sets channels viewers');
    t.equal(channel.get('streamPreview'), 'https://...', 'Sets stream preview url');

    t.end();
  });


  test('Channel model attributes can be modified', function(t) {
    // ARRANGE
    var channel = new Channel();

    // ACT
    channel.set('name', 'Modified Channel Name');

    // ASSERT
    t.equal(channel.get('name'), 'Modified Channel Name', 'Model name can be modified after initialization');

    t.end();
  });


  test('Channel model validates itself', function(t) {
    // ARRANGE
    var channel = new Channel();

    // ACT + ASSERT
    channel.set('twitchId', -1, { validate: true }); // Trigger validation error
    t.ok(channel.validationError, 'The model has a validation error');
    t.equal(channel.validationError, 'Invalid: Channel twitchId must be a positive number', 'Model twitchId is invalid');
    // ACT + ASSERT
    channel.set('name', '', { validate: true }); // Trigger validation error
    t.equal(channel.validationError, 'Invalid: Channel name must be a string and at least one character long', 'Model name is invalid')
    // ACT + ASSERT
    channel.set('closed', 'false', { validate: true });
    t.equal(channel.validationError, 'Invalid: Channel closed property should have a boolean value', 'Model closed property is invalid');
    // ACT + ASSERT
    channel.set('url', 123, { validate: true });
    t.equal(channel.validationError, 'Invalid: Channel url should be a string and at least one character long', 'Model url is invalid');
    // ACT + ASSERT
    channel.set('logo', 123, { validate: true });
    t.equal(channel.validationError, 'Invalid: Channel logo should be a string and at least one character long', 'Model logo is invalid');
    // ACT + ASSERT
    channel.set('followers', -1, { validate: true });
    t.equal(channel.validationError, 'Invalid: Channel followers should be a positive number', 'Model followers is invalid');
    // ACTS + ASSERT
    channel.set('channelStatus', '', { validate: true });
    t.equal(channel.validationError, 'Invalid: Channel status should be a string and at least one character long', 'Model channelStatus is invalid');
    // ACT + ASSERT
    channel.set('streaming', 'false', { validate: true });
    t.equal(channel.validationError, 'Invalid: Channel streaming property should have a boolean value', 'Model streaming is invalid');
    // ACT + ASSERT
    channel.set('streamDescription', '', { validate: true });
    t.equal(channel.validationError, 'Invalid: Channel streamDescription should be a string and at least one character long', 'Model streamingDescription is invalid');
    // ACT + ASSERT
    channel.set('viewers', '100', { validate: true });
    t.equal(channel.validationError, 'Invalid: Channel viewers should be a number', 'Model followers is invalid');
    // ACT + ASSERT
    channel.set('streamPreview', '', { validate: true });
    t.equal(channel.validationError, 'Invalid: Channel streamPreview should be a string and at least one character long', 'Model streamPreview is invalid');

    t.end();
  });
};
