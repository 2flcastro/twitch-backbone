// Unit Tests for Express 'channels' route handler
// File Location: 'handlers/channels.js'

var test = require('tape');
var channelsHandler = require('../../../handlers/channels');

// Export all tests as a function to be run on 'main' file
module.exports = function channelsTests() {
  test('channel-list route tests', function(t) {
    t.equal(typeof channelsHandler.list, 'function', 'channels.list is a function');
    t.end();
  });


  test('getChannelList() tests', function(t) {

    // ====> Integrate test functionality with database lookup...

    // ARRANGE
    // Checks if all items in an array are strings
    function allStrings(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'string') { return false; }
      }
      return true;
    }

    // ACT
    // Call getChannelList() to get list of channels.
    var channelList = channelsHandler.getChannelList();

    // ASSERT
    t.ok(typeof channelsHandler.getChannelList === 'function', 'getChannelList() should be a function');
    t.ok(channelList, 'getChannelList() should return something');
    t.ok(Array.isArray(channelList), 'getChannelList() should return an array');
    t.ok(allStrings(channelList), 'getChannelList() should return an array of all strings');
    t.end();
  });


  test('getChannelIds() tests', function(t) {
    // ARRANGE
    // Create placeholder list of channels. Using sample channel 'dalls' from Twitch API docs.
    var channelList = ['dallas'];

    // Set up unit tests using t.plan() for asynchronous tests.
    t.plan(8);
    t.equal(typeof channelsHandler.getChannelIds, 'function', 'getChannelIds() is a function');

    // ACT
    // Call getChannelsIds(), returns a promise.
    channelsHandler.getChannelIds(channelList).then(function(data) {
      // ASSERT
      // Now that promise is fullfilled, run rest of tests.
      t.ok(Array.isArray(data), 'getChannelIds() retuns an array');
      t.equal(data.length, 1, 'getChanelIds() returns and array with one item');
      t.equal(typeof data[0], 'object', 'returned item is an object');
      t.ok(data[0].users, 'returned item is an object with property "users"');
      t.equal(data[0].users.length, 1, 'returned item should have one user');
      t.ok(data[0].users[0]._id, 'returned item should be one user with an "_id"')
      t.equal(data[0].users[0]._id, '44322889', 'returned id for "dallas" channel should be 44322889');
    });
  });


  test('getChannelData() tests', function(t) {
    // ARRANGE
    // Create placeholder list of channels and channel ids to work with Twitch API.
    // Using sample channel 'dallas' from Twtich API docs.
    var channelList = ['dallas'];
    var channelsData = { dallas: { name: 'dallas', twitchId: 44322889 } };

    t.plan(11);
    t.equal(typeof channelsHandler.getChannelData, 'function', 'getChannelData is a function');

    // ACT
    // Call getChannelData(), returns a promise.
    channelsHandler.getChannelData(channelList, channelsData).then(function(data) {
      // ASSERT
      // Now that promise is fullfilled, run rest of tests.
      t.ok(Array.isArray(data), 'getChannelData() returns an array');
      t.equal(data.length, 1, 'getChannelData() returns an array with one item');
      t.equal(typeof data[0], 'object', 'returned item should be an object');
      t.ok(data[0].name, 'returned item should have a "name" property');
      t.equal(data[0].name, 'dallas', 'returned item should have the name of "dallas"')
      t.ok(data[0]._id, 'returned item has a "_id"');
      t.equal(data[0]._id, '44322889', 'returend item has an id of 44322889');
      t.ok(data[0].url, 'returned item has a url');
      t.ok(data[0].logo, 'returned item has a logo');
      t.ok(data[0].followers, 'returned item has a number of followers');
    });
  });


  test('getStreamData() tests', function(t) {
    /// ARRANGE
    // Create placeholder list of channels and channel ids to work with Twitch API.
    // Using sample channel 'dallas' from Twtich API docs.
    var channelList = ['dallas'];
    var channelsData = { dallas: { name: 'dallas', twitchId: 44322889 } };

    // Set up unit tests using t.plan() for asynchronous tests
    t.plan(4);
    t.equal(typeof channelsHandler.getStreamData, 'function', 'getStreamData() is a function');

    // ACT
    // Call getStreamData(), returns a promise.
    channelsHandler.getStreamData(channelList, channelsData).then(function(data) {
      // ASSERT
      // Now that promise is fullfilled, run rest of tests.
      t.ok(Array.isArray(data), 'getStreamData() returns an array');
      t.equal(data.length, 1, 'getStreamData() returns an array with one item');

      // Since there is no quarantee a channel will be streaming at time of
      // testing, we just check for the 'stream' property in the returned data
      t.ok(data[0].hasOwnProperty('stream'), 'getStreamData() returns item with property "stream"');
    });
  });


  test('getTwitchData() tests', function(t) {
    // ARRANGE
    // Create placeholder list of channels and channel ids to work with Twitch API.
    // Using sample channel 'dallas' from Twtich API docs.
    var channelList = ['dallas'];

    t.plan(14);
    t.equal(typeof channelsHandler.getTwitchData, 'function', 'getTwitchData() is a function');

    // ACT
    // Call getTwitchData(), returns a promise.
    channelsHandler.getTwitchData(channelList).then(function(data) {
      // ASSERT
      // Now that promise is fullfilled, run rest of tests.
      // For properties that can be 'falsy' (e.g null, false, 0), use obj.hasOwnProperty()
      t.ok(Array.isArray(data), 'getTwitchData() returns an array');
      t.equal(data.length, 1, 'getTwitchData() returns an array with one item');
      t.ok(data[0].twitchId, 'channel data has "twitchId"');
      t.equal(data[0].twitchId, '44322889', 'channel id is 44322889');
      t.ok(data[0].hasOwnProperty('closed'), 'channel has "closed" property');
      t.ok(data[0].name, 'channel has a name');
      t.equal(data[0].name, 'dallas', 'channel name should be "dallas"');
      t.ok(data[0].url, 'channel has a url');
      t.ok(data[0].followers, 'channel has a number of followers');
      t.ok(data[0].hasOwnProperty('streaming'), 'channel has "streaming" property');
      t.ok(data[0].streamDescription, 'channel has stream description');
      t.ok(data[0].hasOwnProperty('viewers'), 'channel has a "viewers" property');
      t.ok(data[0].hasOwnProperty('streamPreview'), 'channel has a "streamPreview" property');
    });
  });
}
